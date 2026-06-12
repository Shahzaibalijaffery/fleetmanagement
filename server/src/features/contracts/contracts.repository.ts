import { ContractModel } from '../../models/contract.model';

import type {
  ContractDocument,
  ContractFilter,
  ContractStatus,
  CreateContractData,
  MaintenanceChecklistItemInput,
  UpdateContractInput,
} from './contracts.types';

const POPULATE_FIELDS = [
  { path: 'carId', select: 'brand model year city registrationNumber' },
  { path: 'driverId', select: 'name city experience' },
];

function buildUpdateData(input: UpdateContractInput) {
  const data: Record<string, unknown> = {};

  if (input.contractMode) data.contractMode = input.contractMode;
  if (input.paymentFrequency) data.paymentFrequency = input.paymentFrequency;
  if (input.rentAmount != null) data.rentAmount = input.rentAmount;
  if (input.startDate) data.startDate = new Date(input.startDate);
  if (input.endDate) data.endDate = new Date(input.endDate);
  if (input.fuelResponsibility) data.fuelResponsibility = input.fuelResponsibility;
  if (input.maintenanceResponsibility) {
    data.maintenanceResponsibility = input.maintenanceResponsibility;
  }
  if (input.damageResponsibility) data.damageResponsibility = input.damageResponsibility;
  if (input.initialOdometerKm != null) data.initialOdometerKm = input.initialOdometerKm;
  if (input.currentOdometerKm != null) data.currentOdometerKm = input.currentOdometerKm;
  if (input.maintenanceChecklist) data.maintenanceChecklist = input.maintenanceChecklist;

  return data;
}

function mapMaintenanceChecklistForCreate(
  items: MaintenanceChecklistItemInput[] = [],
) {
  return items.map((item) => ({
    title: item.title.trim(),
    scheduleType: item.scheduleType,
    frequency: item.scheduleType === 'time' ? item.frequency : null,
    mileageIntervalKm: item.scheduleType === 'mileage' ? item.mileageIntervalKm : null,
    lastCompletedAt: null,
    lastCompletedOdometerKm: null,
  }));
}

export const contractsRepository = {
  create(data: CreateContractData) {
    return ContractModel.create({
      ...data,
      maintenanceChecklist: mapMaintenanceChecklistForCreate(data.maintenanceChecklist),
    });
  },

  findById(contractId: string) {
    return ContractModel.findById(contractId)
      .populate(POPULATE_FIELDS)
      .lean<ContractDocument>();
  },

  findActiveByAssignmentId(assignmentId: string) {
    return ContractModel.findOne({ assignmentId, status: 'active' })
      .populate(POPULATE_FIELDS)
      .lean<ContractDocument>();
  },

  findPaginated(filter: ContractFilter, skip: number, limit: number) {
    return ContractModel.find(filter)
      .populate(POPULATE_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<ContractDocument[]>();
  },

  count(filter: ContractFilter) {
    return ContractModel.countDocuments(filter);
  },

  updateById(contractId: string, input: UpdateContractInput) {
    const updateData = buildUpdateData(input);

    if (input.maintenanceChecklist) {
      updateData.maintenanceChecklist = mapMaintenanceChecklistForCreate(input.maintenanceChecklist);
    }

    return ContractModel.findByIdAndUpdate(contractId, updateData, { new: true })
      .populate(POPULATE_FIELDS)
      .lean<ContractDocument>();
  },

  updateOdometer(contractId: string, currentOdometerKm: number) {
    return ContractModel.findByIdAndUpdate(
      contractId,
      { currentOdometerKm },
      { new: true },
    )
      .populate(POPULATE_FIELDS)
      .lean<ContractDocument>();
  },

  completeTimeMaintenanceItem(contractId: string, itemId: string, completedAt: Date) {
    return ContractModel.findOneAndUpdate(
      { _id: contractId, 'maintenanceChecklist._id': itemId },
      {
        $set: {
          'maintenanceChecklist.$.lastCompletedAt': completedAt,
          'maintenanceChecklist.$.lastCompletedOdometerKm': null,
        },
      },
      { new: true },
    )
      .populate(POPULATE_FIELDS)
      .lean<ContractDocument>();
  },

  completeMileageMaintenanceItem(
    contractId: string,
    itemId: string,
    completedAt: Date,
    currentOdometerKm: number,
  ) {
    return ContractModel.findOneAndUpdate(
      { _id: contractId, 'maintenanceChecklist._id': itemId },
      {
        $set: {
          currentOdometerKm,
          'maintenanceChecklist.$.lastCompletedAt': completedAt,
          'maintenanceChecklist.$.lastCompletedOdometerKm': currentOdometerKm,
        },
      },
      { new: true },
    )
      .populate(POPULATE_FIELDS)
      .lean<ContractDocument>();
  },

  updateStatusById(contractId: string, status: ContractStatus) {
    return ContractModel.findByIdAndUpdate(contractId, { status }, { new: true })
      .populate(POPULATE_FIELDS)
      .lean<ContractDocument>();
  },
};
