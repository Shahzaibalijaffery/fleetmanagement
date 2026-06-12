import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/AppError';
import { buildMeta } from '../../shared/types/pagination.types';
import { assignmentsRepository } from '../assignments/assignments.repository';
import { paymentsService } from '../payments/payments.service';

import type {
  Contract,
  ContractDocument,
  CreateContractInput,
  ListContractsQuery,
  UpdateContractInput,
  UpdateContractOdometerInput,
} from './contracts.types';
import {
  enrichMaintenanceChecklist,
  hasMileageChecklistItems,
} from './maintenanceChecklist.utils';
import { contractsRepository } from './contracts.repository';

function toContract(doc: ContractDocument): Contract {
  return {
    id: doc._id.toString(),
    assignmentId: doc.assignmentId.toString(),
    driverId: doc.driverId._id.toString(),
    carId: doc.carId._id.toString(),
    ownerId: doc.ownerId.toString(),
    contractMode: doc.contractMode,
    paymentFrequency: doc.paymentFrequency,
    rentAmount: doc.rentAmount,
    startDate: doc.startDate,
    endDate: doc.endDate,
    fuelResponsibility: doc.fuelResponsibility,
    maintenanceResponsibility: doc.maintenanceResponsibility,
    damageResponsibility: doc.damageResponsibility,
    status: doc.status,
    initialOdometerKm: doc.initialOdometerKm ?? 0,
    currentOdometerKm: doc.currentOdometerKm ?? 0,
    maintenanceChecklist: enrichMaintenanceChecklist(doc),
    car: {
      id: doc.carId._id.toString(),
      brand: doc.carId.brand,
      model: doc.carId.model,
      year: doc.carId.year,
      city: doc.carId.city,
      registrationNumber: doc.carId.registrationNumber,
    },
    driver: {
      id: doc.driverId._id.toString(),
      name: doc.driverId.name,
      city: doc.driverId.city,
      experience: doc.driverId.experience,
    },
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function parseDate(value: string, field: string): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${field} is invalid`);
  }

  return date;
}

function validateDateRange(startDate: Date, endDate: Date): void {
  if (endDate.getTime() <= startDate.getTime()) {
    throw new ValidationError('End date must be after start date');
  }
}

function assertContractAccess(
  doc: ContractDocument,
  userId: string,
  role: 'owner' | 'driver',
): void {
  const isDriver = role === 'driver' && doc.driverId._id.toString() === userId;
  const isOwner = role === 'owner' && doc.ownerId.toString() === userId;

  if (!isDriver && !isOwner) {
    throw new ForbiddenError('Access denied');
  }
}

function assertContractActiveWithinPeriod(doc: ContractDocument): void {
  if (doc.status !== 'active') {
    throw new ValidationError('This action is only available for active contracts');
  }

  const now = new Date();

  if (now < doc.startDate) {
    throw new ValidationError('This contract has not started yet');
  }

  if (now > doc.endDate) {
    throw new ValidationError('This contract has ended');
  }
}

function resolveInitialOdometer(input: CreateContractInput | UpdateContractInput): number {
  const items = input.maintenanceChecklist ?? [];

  if (hasMileageChecklistItems(items)) {
    if (input.initialOdometerKm == null) {
      throw new ValidationError(
        'Initial odometer reading is required when mileage-based checklist items are included',
      );
    }

    return input.initialOdometerKm;
  }

  return input.initialOdometerKm ?? 0;
}

export const contractsService = {
  async createContract(ownerId: string, input: CreateContractInput): Promise<Contract> {
    const assignment = await assignmentsRepository.findById(input.assignmentId);

    if (!assignment) {
      throw new NotFoundError('Assignment not found');
    }

    if (assignment.ownerId.toString() !== ownerId) {
      throw new ForbiddenError('Access denied');
    }

    if (assignment.status !== 'active') {
      throw new ValidationError('Contracts can only be created for active assignments');
    }

    const existing = await contractsRepository.findActiveByAssignmentId(input.assignmentId);

    if (existing) {
      throw new ConflictError('An active contract already exists for this assignment');
    }

    const startDate = parseDate(input.startDate, 'Start date');
    const endDate = parseDate(input.endDate, 'End date');
    validateDateRange(startDate, endDate);

    const initialOdometerKm = resolveInitialOdometer(input);
    const maintenanceChecklist = input.maintenanceChecklist ?? [];

    const contractDoc = await contractsRepository.create({
      assignmentId: input.assignmentId,
      driverId: assignment.driverId._id.toString(),
      carId: assignment.carId._id.toString(),
      ownerId,
      contractMode: input.contractMode,
      paymentFrequency: input.paymentFrequency,
      rentAmount: input.rentAmount,
      startDate,
      endDate,
      fuelResponsibility: input.fuelResponsibility,
      maintenanceResponsibility: input.maintenanceResponsibility,
      damageResponsibility: input.damageResponsibility,
      status: 'active',
      initialOdometerKm,
      currentOdometerKm: initialOdometerKm,
      maintenanceChecklist,
    });

    await paymentsService.createInitialPayment({
      contractId: contractDoc._id.toString(),
      ownerId,
      driverId: assignment.driverId._id.toString(),
      amount: input.rentAmount,
      dueDate: startDate,
    });

    const populated = await contractsRepository.findById(contractDoc._id.toString());

    if (!populated) {
      throw new NotFoundError('Contract not found');
    }

    return toContract(populated);
  },

  async listContracts(
    userId: string,
    role: 'owner' | 'driver',
    query: ListContractsQuery,
  ) {
    const filter: { driverId?: string; ownerId?: string; status?: typeof query.status } =
      role === 'driver' ? { driverId: userId } : { ownerId: userId };

    if (query.status) {
      filter.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;

    const [contracts, total] = await Promise.all([
      contractsRepository.findPaginated(filter, skip, query.limit),
      contractsRepository.count(filter),
    ]);

    return {
      data: contracts.map(toContract),
      meta: buildMeta(query.page, query.limit, total),
    };
  },

  async getContract(
    userId: string,
    role: 'owner' | 'driver',
    contractId: string,
  ): Promise<Contract> {
    const contract = await contractsRepository.findById(contractId);

    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    assertContractAccess(contract, userId, role);

    return toContract(contract);
  },

  async getContractByAssignment(
    userId: string,
    role: 'owner' | 'driver',
    assignmentId: string,
  ): Promise<Contract | null> {
    const assignment = await assignmentsRepository.findById(assignmentId);

    if (!assignment) {
      throw new NotFoundError('Assignment not found');
    }

    const isDriver = role === 'driver' && assignment.driverId._id.toString() === userId;
    const isOwner = role === 'owner' && assignment.ownerId.toString() === userId;

    if (!isDriver && !isOwner) {
      throw new ForbiddenError('Access denied');
    }

    const contract = await contractsRepository.findActiveByAssignmentId(assignmentId);

    if (!contract) {
      return null;
    }

    return toContract(contract);
  },

  async updateContract(
    ownerId: string,
    contractId: string,
    input: UpdateContractInput,
  ): Promise<Contract> {
    const contract = await contractsRepository.findById(contractId);

    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    if (contract.ownerId.toString() !== ownerId) {
      throw new ForbiddenError('Access denied');
    }

    if (contract.status !== 'active') {
      throw new ValidationError('Only active contracts can be updated');
    }

    const startDate = input.startDate ? parseDate(input.startDate, 'Start date') : contract.startDate;
    const endDate = input.endDate ? parseDate(input.endDate, 'End date') : contract.endDate;
    validateDateRange(startDate, endDate);

    if (input.maintenanceChecklist) {
      const mergedInput = {
        ...input,
        initialOdometerKm: input.initialOdometerKm ?? contract.initialOdometerKm,
      };
      resolveInitialOdometer(mergedInput);
    }

    const updated = await contractsRepository.updateById(contractId, input);

    if (!updated) {
      throw new NotFoundError('Contract not found');
    }

    return toContract(updated);
  },

  async updateOdometer(
    userId: string,
    role: 'owner' | 'driver',
    contractId: string,
    input: UpdateContractOdometerInput,
  ): Promise<Contract> {
    const contract = await contractsRepository.findById(contractId);

    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    assertContractAccess(contract, userId, role);
    assertContractActiveWithinPeriod(contract);

    if (input.currentOdometerKm < contract.initialOdometerKm) {
      throw new ValidationError('Current odometer cannot be less than the initial reading');
    }

    const updated = await contractsRepository.updateOdometer(contractId, input.currentOdometerKm);

    if (!updated) {
      throw new NotFoundError('Contract not found');
    }

    return toContract(updated);
  },

  async completeMaintenanceItem(
    userId: string,
    role: 'owner' | 'driver',
    contractId: string,
    itemId: string,
    currentOdometerKm?: number,
  ): Promise<Contract> {
    const contract = await contractsRepository.findById(contractId);

    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    assertContractAccess(contract, userId, role);
    assertContractActiveWithinPeriod(contract);

    const item = contract.maintenanceChecklist.find((entry) => entry._id.toString() === itemId);

    if (!item) {
      throw new NotFoundError('Maintenance item not found');
    }

    const completedAt = new Date();

    if (item.scheduleType === 'time') {
      const updated = await contractsRepository.completeTimeMaintenanceItem(
        contractId,
        itemId,
        completedAt,
      );

      if (!updated) {
        throw new NotFoundError('Maintenance item not found');
      }

      return toContract(updated);
    }

    const effectiveCurrent = Math.max(
      contract.currentOdometerKm,
      contract.initialOdometerKm,
    );
    let nextOdometer = currentOdometerKm ?? effectiveCurrent;

    if (nextOdometer < contract.initialOdometerKm) {
      nextOdometer = effectiveCurrent;
    }

    if (nextOdometer < contract.initialOdometerKm) {
      throw new ValidationError('Odometer cannot be less than the initial reading');
    }

    const updated = await contractsRepository.completeMileageMaintenanceItem(
      contractId,
      itemId,
      completedAt,
      nextOdometer,
    );

    if (!updated) {
      throw new NotFoundError('Maintenance item not found');
    }

    return toContract(updated);
  },
};
