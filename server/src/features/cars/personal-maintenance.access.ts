import { ForbiddenError, NotFoundError, ValidationError } from '../../shared/errors/AppError';

import { carsRepository } from './cars.repository';
import type { CarDocument } from './cars.types';

export async function assertPersonalCar(ownerId: string, carId: string): Promise<CarDocument> {
  const car = await carsRepository.findById(carId);

  if (!car) {
    throw new NotFoundError('Car not found');
  }

  if (car.ownerId.toString() !== ownerId) {
    throw new ForbiddenError('Access denied');
  }

  if (car.status !== 'personal_use') {
    throw new ValidationError('This action is only available for personal use cars');
  }

  return car;
}
