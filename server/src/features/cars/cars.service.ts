import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/AppError';
import { geocodeCity, toGeoPoint } from '../../shared/geo/cityGeocoder';
import { buildMeta } from '../../shared/types/pagination.types';

import type {
  Car,
  CarDocument,
  CarStatus,
  CreateCarInput,
  ListCarsQuery,
  UpdateCarInput,
  UpdatePersonalMaintenanceInput,
  UpdatePersonalOdometerInput,
} from './cars.types';
import { carExpensesRepository } from '../car-expenses/car-expenses.repository';

import { carsRepository, type UpdateCarData } from './cars.repository';
import {
  DEFAULT_PERSONAL_MAINTENANCE_PRESETS,
  enrichPersonalMaintenanceChecklist,
  hasMileagePersonalItems,
} from './personal-maintenance.utils';

function toCar(car: CarDocument): Car {
  const base: Car = {
    id: car._id.toString(),
    ownerId: car.ownerId.toString(),
    brand: car.brand,
    model: car.model,
    year: car.year,
    registrationNumber: car.registrationNumber,
    city: car.city,
    carType: car.carType,
    status: car.status,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
  };

  if (car.status === 'personal_use') {
    base.personalMaintenanceChecklist = enrichPersonalMaintenanceChecklist(car);
    base.personalInitialOdometerKm = car.personalInitialOdometerKm ?? 0;
    base.personalCurrentOdometerKm = car.personalCurrentOdometerKm ?? 0;
  }

  return base;
}

async function assertPersonalCar(ownerId: string, carId: string): Promise<CarDocument> {
  const car = await carsRepository.findById(carId);

  if (!car) {
    throw new NotFoundError('Car not found');
  }

  assertOwnerAccess(car, ownerId);

  if (car.status !== 'personal_use') {
    throw new ValidationError('This action is only available for personal use cars');
  }

  return car;
}

function normalizeRegistrationNumber(value: string): string {
  return value.trim().toUpperCase();
}

function assertOwnerAccess(car: CarDocument, ownerId: string): void {
  if (car.ownerId.toString() !== ownerId) {
    throw new ForbiddenError('Access denied');
  }
}

function validateStatusTransition(current: CarStatus, next: CarStatus): void {
  if (current === 'assigned' && next === 'inactive') {
    throw new ValidationError('Cannot deactivate a car that is currently assigned');
  }

  if (current === 'assigned' && next !== 'assigned') {
    throw new ValidationError('Cannot change status while the car is assigned');
  }

  if (current === 'personal_use' && next === 'assigned') {
    throw new ValidationError('Personal use cars cannot be assigned to drivers');
  }

  if (next === 'assigned' && current !== 'assigned') {
    throw new ValidationError('Assigned status is set automatically when a driver is assigned');
  }
}

export const carsService = {
  async listCars(ownerId: string, query: ListCarsQuery) {
    const filter = { ownerId, status: query.status };
    const skip = (query.page - 1) * query.limit;

    const [cars, total] = await Promise.all([
      carsRepository.findPaginated(filter, skip, query.limit),
      carsRepository.count(filter),
    ]);

    return {
      data: cars.map(toCar),
      meta: buildMeta(query.page, query.limit, total),
    };
  },

  async getCar(ownerId: string, carId: string): Promise<Car> {
    const car = await carsRepository.findById(carId);

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    assertOwnerAccess(car, ownerId);

    return toCar(car);
  },

  async createCar(ownerId: string, input: CreateCarInput): Promise<Car> {
    const registrationNumber = normalizeRegistrationNumber(input.registrationNumber);

    const existing = await carsRepository.findByRegistrationNumber(registrationNumber);

    if (existing) {
      throw new ConflictError('Registration number already exists');
    }

    const city = input.city.trim();
    const coords = geocodeCity(city);

    const status = input.status ?? 'available';
    const isPersonalUse = status === 'personal_use';

    const car = await carsRepository.create({
      ownerId,
      brand: input.brand.trim(),
      model: input.model.trim(),
      year: input.year,
      registrationNumber,
      city,
      ...(coords ? { location: toGeoPoint(coords) } : {}),
      carType: input.carType,
      status,
      ...(isPersonalUse
        ? {
            personalMaintenanceChecklist: DEFAULT_PERSONAL_MAINTENANCE_PRESETS.map((item) => ({
              title: item.title,
              scheduleType: item.scheduleType,
              frequency: item.scheduleType === 'time' ? item.frequency : null,
              mileageIntervalKm: item.scheduleType === 'mileage' ? item.mileageIntervalKm : null,
              lastCompletedAt: null,
              lastCompletedOdometerKm: null,
            })),
            personalInitialOdometerKm: 0,
            personalCurrentOdometerKm: 0,
          }
        : {}),
    });

    return toCar(car.toObject() as CarDocument);
  },

  async updateCar(ownerId: string, carId: string, input: UpdateCarInput): Promise<Car> {
    const existing = await carsRepository.findById(carId);

    if (!existing) {
      throw new NotFoundError('Car not found');
    }

    assertOwnerAccess(existing, ownerId);

    if (input.status && input.status !== existing.status) {
      validateStatusTransition(existing.status, input.status);
    }

    const updateData: UpdateCarData = { ...input };

    if (input.registrationNumber) {
      const registrationNumber = normalizeRegistrationNumber(input.registrationNumber);

      if (registrationNumber !== existing.registrationNumber) {
        const duplicate = await carsRepository.findByRegistrationNumber(registrationNumber);

        if (duplicate && duplicate._id.toString() !== carId) {
          throw new ConflictError('Registration number already exists');
        }
      }

      updateData.registrationNumber = registrationNumber;
    }

    if (input.brand) updateData.brand = input.brand.trim();
    if (input.model) updateData.model = input.model.trim();
    if (input.city) {
      const city = input.city.trim();
      updateData.city = city;
      const coords = geocodeCity(city);
      updateData.location = coords ? toGeoPoint(coords) : null;
    }

    let car = await carsRepository.updateById(carId, updateData);

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    const switchingToPersonal =
      input.status === 'personal_use' && existing.status !== 'personal_use';

    if (switchingToPersonal && !(car.personalMaintenanceChecklist?.length ?? 0)) {
      const seeded = await carsRepository.updatePersonalMaintenance(
        carId,
        DEFAULT_PERSONAL_MAINTENANCE_PRESETS,
        car.personalInitialOdometerKm ?? 0,
      );

      if (seeded) {
        car = seeded;
      }
    }

    return toCar(car);
  },

  async deleteCar(ownerId: string, carId: string): Promise<void> {
    const existing = await carsRepository.findById(carId);

    if (!existing) {
      throw new NotFoundError('Car not found');
    }

    assertOwnerAccess(existing, ownerId);

    if (existing.status === 'assigned') {
      throw new ValidationError('Cannot delete a car that is currently assigned');
    }

    await carExpensesRepository.deleteByCarId(carId);
    await carsRepository.deleteById(carId);
  },

  async updatePersonalMaintenance(
    ownerId: string,
    carId: string,
    input: UpdatePersonalMaintenanceInput,
  ): Promise<Car> {
    await assertPersonalCar(ownerId, carId);

    if (
      hasMileagePersonalItems(input.personalMaintenanceChecklist) &&
      input.personalInitialOdometerKm == null
    ) {
      throw new ValidationError('Initial odometer is required when using mileage-based items');
    }

    const car = await carsRepository.updatePersonalMaintenance(
      carId,
      input.personalMaintenanceChecklist,
      input.personalInitialOdometerKm,
    );

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    return toCar(car);
  },

  async updatePersonalOdometer(
    ownerId: string,
    carId: string,
    input: UpdatePersonalOdometerInput,
  ): Promise<Car> {
    const car = await assertPersonalCar(ownerId, carId);
    const initialKm = car.personalInitialOdometerKm ?? 0;

    if (input.personalCurrentOdometerKm < initialKm) {
      throw new ValidationError('Current odometer cannot be less than the initial reading');
    }

    const updated = await carsRepository.updatePersonalOdometer(
      carId,
      input.personalCurrentOdometerKm,
    );

    if (!updated) {
      throw new NotFoundError('Car not found');
    }

    return toCar(updated);
  },

  async completePersonalMaintenanceItem(
    ownerId: string,
    carId: string,
    itemId: string,
    personalCurrentOdometerKm?: number,
  ): Promise<Car> {
    const car = await assertPersonalCar(ownerId, carId);
    const item = car.personalMaintenanceChecklist?.find(
      (entry) => entry._id.toString() === itemId,
    );

    if (!item) {
      throw new NotFoundError('Maintenance item not found');
    }

    const completedAt = new Date();

    if (item.scheduleType === 'time') {
      const updated = await carsRepository.completePersonalTimeItem(carId, itemId, completedAt);

      if (!updated) {
        throw new NotFoundError('Maintenance item not found');
      }

      return toCar(updated);
    }

    const initialKm = car.personalInitialOdometerKm ?? 0;
    const effectiveCurrent = Math.max(car.personalCurrentOdometerKm ?? initialKm, initialKm);
    let nextOdometer = personalCurrentOdometerKm ?? effectiveCurrent;

    if (nextOdometer < initialKm) {
      nextOdometer = effectiveCurrent;
    }

    const updated = await carsRepository.completePersonalMileageItem(
      carId,
      itemId,
      completedAt,
      nextOdometer,
    );

    if (!updated) {
      throw new NotFoundError('Maintenance item not found');
    }

    return toCar(updated);
  },
};
