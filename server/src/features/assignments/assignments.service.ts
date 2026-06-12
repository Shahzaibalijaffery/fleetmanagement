import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/AppError';
import { buildMeta } from '../../shared/types/pagination.types';
import { userRepository } from '../auth/user.repository';
import { carsRepository } from '../cars/cars.repository';
import type { CarDocument } from '../cars/cars.types';
import type { CarRequestDocument } from '../requests/requests.types';
import { requestsRepository } from '../requests/requests.repository';

import type {
  Assignment,
  AssignmentDocument,
  ListAssignmentsQuery,
} from './assignments.types';
import { assignmentsRepository } from './assignments.repository';

function toAssignment(doc: AssignmentDocument): Assignment {
  return {
    id: doc._id.toString(),
    driverId: doc.driverId._id.toString(),
    carId: doc.carId._id.toString(),
    ownerId: doc.ownerId.toString(),
    requestId: doc.requestId.toString(),
    status: doc.status,
    car: {
      id: doc.carId._id.toString(),
      brand: doc.carId.brand,
      model: doc.carId.model,
      year: doc.carId.year,
      city: doc.carId.city,
      carType: doc.carId.carType,
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

function getRefId(ref: { _id: { toString(): string } }): string {
  return ref._id.toString();
}

function assertCarAvailable(car: CarDocument): void {
  if (car.status !== 'available') {
    throw new ValidationError('This car is not available for assignment');
  }
}

export const assignmentsService = {
  async createFromAcceptedRequest(
    ownerId: string,
    request: CarRequestDocument,
    requestId: string,
  ): Promise<Assignment> {
    if (request.ownerId.toString() !== ownerId) {
      throw new ForbiddenError('Access denied');
    }

    if (request.status !== 'pending') {
      throw new ValidationError('Only pending requests can be accepted');
    }

    const carId = getRefId(request.carId);
    const driverId = getRefId(request.driverId);

    const car = await carsRepository.findById(carId);

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    assertCarAvailable(car);

    const driver = await userRepository.findById(driverId);

    if (!driver || driver.driverStatus !== 'available') {
      throw new ValidationError('Driver is no longer available');
    }

    const existingCarAssignment = await assignmentsRepository.findActiveByCarId(carId);

    if (existingCarAssignment) {
      throw new ConflictError('This car already has an active assignment');
    }

    const existingDriverAssignment = await assignmentsRepository.findActiveByDriverId(driverId);

    if (existingDriverAssignment) {
      throw new ConflictError('This driver already has an active assignment');
    }

    const assignmentDoc = await assignmentsRepository.create({
      driverId,
      carId,
      ownerId,
      requestId,
      status: 'active',
    });

    await carsRepository.updateById(carId, { status: 'assigned' });
    await userRepository.updateDriverStatus(driverId, 'busy');
    await requestsRepository.rejectPendingByCarId(carId, requestId);
    await requestsRepository.updateStatusById(requestId, 'accepted');

    const populated = await assignmentsRepository.findById(assignmentDoc._id.toString());

    if (!populated) {
      throw new NotFoundError('Assignment not found');
    }

    return toAssignment(populated);
  },

  async listAssignments(
    userId: string,
    role: 'owner' | 'driver',
    query: ListAssignmentsQuery,
  ) {
    const filter =
      role === 'driver' ? { driverId: userId } : { ownerId: userId };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.carId) {
      filter.carId = query.carId;
    }

    const skip = (query.page - 1) * query.limit;

    const [assignments, total] = await Promise.all([
      assignmentsRepository.findPaginated(filter, skip, query.limit),
      assignmentsRepository.count(filter),
    ]);

    return {
      data: assignments.map(toAssignment),
      meta: buildMeta(query.page, query.limit, total),
    };
  },

  async getAssignment(
    userId: string,
    role: 'owner' | 'driver',
    assignmentId: string,
  ): Promise<Assignment> {
    const assignment = await assignmentsRepository.findById(assignmentId);

    if (!assignment) {
      throw new NotFoundError('Assignment not found');
    }

    const isDriver = role === 'driver' && getRefId(assignment.driverId) === userId;
    const isOwner = role === 'owner' && assignment.ownerId.toString() === userId;

    if (!isDriver && !isOwner) {
      throw new ForbiddenError('Access denied');
    }

    return toAssignment(assignment);
  },

  async getActiveAssignmentForDriver(driverId: string): Promise<Assignment | null> {
    const assignment = await assignmentsRepository.findActiveByDriverId(driverId);

    if (!assignment) {
      return null;
    }

    return toAssignment(assignment);
  },

  async getActiveAssignmentForCar(
    ownerId: string,
    carId: string,
  ): Promise<Assignment | null> {
    const car = await carsRepository.findById(carId);

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    if (car.ownerId.toString() !== ownerId) {
      throw new ForbiddenError('Access denied');
    }

    const assignment = await assignmentsRepository.findActiveByCarId(carId);

    if (!assignment) {
      return null;
    }

    return toAssignment(assignment);
  },
};
