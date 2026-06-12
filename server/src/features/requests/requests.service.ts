import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/AppError';
import { buildMeta } from '../../shared/types/pagination.types';
import { assignmentsService } from '../assignments/assignments.service';
import { userRepository } from '../auth/user.repository';
import { carsRepository } from '../cars/cars.repository';
import type { CarDocument } from '../cars/cars.types';

import type {
  CarRequest,
  CarRequestDocument,
  CreateRequestInput,
  ListRequestsQuery,
} from './requests.types';
import { requestsRepository } from './requests.repository';

function toCarRequest(doc: CarRequestDocument): CarRequest {
  return {
    id: doc._id.toString(),
    driverId: doc.driverId._id.toString(),
    carId: doc.carId._id.toString(),
    ownerId: doc.ownerId.toString(),
    status: doc.status,
    car: {
      id: doc.carId._id.toString(),
      brand: doc.carId.brand,
      model: doc.carId.model,
      year: doc.carId.year,
      city: doc.carId.city,
      carType: doc.carId.carType,
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

function assertCarAvailable(car: CarDocument): void {
  if (car.status !== 'available') {
    throw new ValidationError('This car is not available for requests');
  }
}

function getRefId(ref: { _id: { toString(): string } }): string {
  return ref._id.toString();
}

export const requestsService = {
  async createRequest(driverId: string, input: CreateRequestInput): Promise<CarRequest> {
    const driver = await userRepository.findById(driverId);

    if (!driver || driver.role !== 'driver') {
      throw new ForbiddenError('Only drivers can request cars');
    }

    if (driver.driverStatus !== 'available') {
      throw new ValidationError('You must be available to request a car');
    }

    const car = await carsRepository.findById(input.carId);

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    assertCarAvailable(car);

    const existing = await requestsRepository.findPendingByCarAndDriver(input.carId, driverId);

    if (existing) {
      throw new ConflictError('You already have a pending request for this car');
    }

    const requestDoc = await requestsRepository.create({
      driverId,
      carId: input.carId,
      ownerId: car.ownerId.toString(),
      status: 'pending',
    });

    const populated = await requestsRepository.findById(requestDoc._id.toString());

    if (!populated) {
      throw new NotFoundError('Request not found');
    }

    return toCarRequest(populated);
  },

  async listRequests(
    userId: string,
    role: 'owner' | 'driver',
    query: ListRequestsQuery,
  ) {
    const filter = role === 'driver' ? { driverId: userId } : { ownerId: userId };

    if (query.status) {
      filter.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;

    const [requests, total] = await Promise.all([
      requestsRepository.findPaginated(filter, skip, query.limit),
      requestsRepository.count(filter),
    ]);

    return {
      data: requests.map(toCarRequest),
      meta: buildMeta(query.page, query.limit, total),
    };
  },

  async getRequest(userId: string, role: 'owner' | 'driver', requestId: string): Promise<CarRequest> {
    const request = await requestsRepository.findById(requestId);

    if (!request) {
      throw new NotFoundError('Request not found');
    }

    const isDriver = role === 'driver' && getRefId(request.driverId) === userId;
    const isOwner = role === 'owner' && request.ownerId.toString() === userId;

    if (!isDriver && !isOwner) {
      throw new ForbiddenError('Access denied');
    }

    return toCarRequest(request);
  },

  async acceptRequest(ownerId: string, requestId: string): Promise<CarRequest> {
    const request = await requestsRepository.findById(requestId);

    if (!request) {
      throw new NotFoundError('Request not found');
    }

    if (request.ownerId.toString() !== ownerId) {
      throw new ForbiddenError('Access denied');
    }

    if (request.status !== 'pending') {
      throw new ValidationError('Only pending requests can be accepted');
    }

    await assignmentsService.createFromAcceptedRequest(ownerId, request, requestId);

    const updated = await requestsRepository.findById(requestId);

    if (!updated) {
      throw new NotFoundError('Request not found');
    }

    return toCarRequest(updated);
  },

  async rejectRequest(ownerId: string, requestId: string): Promise<CarRequest> {
    const request = await requestsRepository.findById(requestId);

    if (!request) {
      throw new NotFoundError('Request not found');
    }

    if (request.ownerId.toString() !== ownerId) {
      throw new ForbiddenError('Access denied');
    }

    if (request.status !== 'pending') {
      throw new ValidationError('Only pending requests can be rejected');
    }

    const updated = await requestsRepository.updateStatusById(requestId, 'rejected');

    if (!updated) {
      throw new NotFoundError('Request not found');
    }

    return toCarRequest(updated);
  },
};
