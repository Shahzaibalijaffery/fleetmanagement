import type { Car, CarDocument } from './cars.types';
import { enrichPersonalMaintenanceChecklist } from './personal-maintenance.utils';

export function toCar(car: CarDocument): Car {
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
    base.personalCurrentOdometerKm = car.personalCurrentOdometerKm ?? 0;
  }

  return base;
}
