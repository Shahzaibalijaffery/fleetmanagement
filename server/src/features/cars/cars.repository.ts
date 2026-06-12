import { CarModel } from '../../models/car.model';

import type { MaintenanceChecklistItemInput } from '../contracts/contracts.types';

import type { CarDocument, CarStatus, CarType, CreateCarInput } from './cars.types';

function mapPersonalMaintenanceForSave(items: MaintenanceChecklistItemInput[] = []) {
  return items.map((item) => ({
    title: item.title.trim(),
    scheduleType: item.scheduleType,
    frequency: item.scheduleType === 'time' ? item.frequency : null,
    mileageIntervalKm: item.scheduleType === 'mileage' ? item.mileageIntervalKm : null,
    lastCompletedAt: null,
    lastCompletedOdometerKm: null,
  }));
}

export interface CreateCarData extends CreateCarInput {
  ownerId: string;
  registrationNumber: string;
}

export interface UpdateCarData {
  brand?: string;
  model?: string;
  year?: number;
  registrationNumber?: string;
  city?: string;
  location?: { type: 'Point'; coordinates: [number, number] } | null;
  carType?: CarType;
  status?: CarStatus;
}

export interface CarFilter {
  ownerId: string;
  status?: CarStatus;
}

export const carsRepository = {
  create(data: CreateCarData) {
    return CarModel.create(data);
  },

  findById(carId: string) {
    return CarModel.findById(carId).lean<CarDocument>();
  },

  findByRegistrationNumber(registrationNumber: string) {
    return CarModel.findOne({ registrationNumber }).lean<CarDocument>();
  },

  findPaginated(filter: CarFilter, skip: number, limit: number) {
    const query: CarFilter = { ownerId: filter.ownerId };
    if (filter.status) {
      query.status = filter.status;
    }

    return CarModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<CarDocument[]>();
  },

  count(filter: CarFilter) {
    const query: CarFilter = { ownerId: filter.ownerId };
    if (filter.status) {
      query.status = filter.status;
    }

    return CarModel.countDocuments(query);
  },

  updateById(carId: string, data: UpdateCarData) {
    return CarModel.findByIdAndUpdate(carId, data, { new: true }).lean<CarDocument>();
  },

  deleteById(carId: string) {
    return CarModel.findByIdAndDelete(carId).lean<CarDocument>();
  },

  updatePersonalMaintenance(
    carId: string,
    checklist: MaintenanceChecklistItemInput[],
    personalInitialOdometerKm?: number,
  ) {
    const update: Record<string, unknown> = {
      personalMaintenanceChecklist: mapPersonalMaintenanceForSave(checklist),
    };

    if (personalInitialOdometerKm != null) {
      update.personalInitialOdometerKm = personalInitialOdometerKm;
      update.personalCurrentOdometerKm = personalInitialOdometerKm;
    }

    return CarModel.findByIdAndUpdate(carId, update, { new: true }).lean<CarDocument>();
  },

  updatePersonalOdometer(carId: string, personalCurrentOdometerKm: number) {
    return CarModel.findByIdAndUpdate(
      carId,
      { personalCurrentOdometerKm },
      { new: true },
    ).lean<CarDocument>();
  },

  completePersonalTimeItem(carId: string, itemId: string, completedAt: Date) {
    return CarModel.findOneAndUpdate(
      { _id: carId, 'personalMaintenanceChecklist._id': itemId },
      {
        $set: {
          'personalMaintenanceChecklist.$.lastCompletedAt': completedAt,
          'personalMaintenanceChecklist.$.lastCompletedOdometerKm': null,
        },
      },
      { new: true },
    ).lean<CarDocument>();
  },

  completePersonalMileageItem(
    carId: string,
    itemId: string,
    completedAt: Date,
    personalCurrentOdometerKm: number,
  ) {
    return CarModel.findOneAndUpdate(
      { _id: carId, 'personalMaintenanceChecklist._id': itemId },
      {
        $set: {
          personalCurrentOdometerKm,
          'personalMaintenanceChecklist.$.lastCompletedAt': completedAt,
          'personalMaintenanceChecklist.$.lastCompletedOdometerKm': personalCurrentOdometerKm,
        },
      },
      { new: true },
    ).lean<CarDocument>();
  },
};
