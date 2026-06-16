import { NotFoundError, ValidationError } from '../../shared/errors/AppError';

import { expensesService } from '../expenses/expenses.service';
import { notificationRemindersService } from '../notification-reminders/notification-reminders.service';

import { toCar } from './cars.mapper';
import { carsRepository } from './cars.repository';
import type {
  Car,
  CarDocument,
  UpdatePersonalMaintenanceInput,
  UpdatePersonalMaintenanceItemInput,
  UpdatePersonalOdometerInput,
} from './cars.types';
import {
  DUPLICATE_MILEAGE_COMPLETION_MESSAGE,
  isDuplicateMileageCompletion,
  parseMaintenanceDate,
} from './personal-maintenance.utils';
import { assertPersonalCar } from './personal-maintenance.access';

export const personalMaintenanceService = {
  async updatePersonalMaintenance(
    ownerId: string,
    carId: string,
    input: UpdatePersonalMaintenanceInput,
  ): Promise<Car> {
    await assertPersonalCar(ownerId, carId);

    const car = await carsRepository.updatePersonalMaintenance(
      carId,
      input.personalMaintenanceChecklist,
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
    await assertPersonalCar(ownerId, carId);

    const updated = await carsRepository.updatePersonalOdometer(
      carId,
      input.personalCurrentOdometerKm,
    );

    if (!updated) {
      throw new NotFoundError('Car not found');
    }

    return toCar(updated);
  },

  async updatePersonalMaintenanceItem(
    ownerId: string,
    carId: string,
    itemId: string,
    input: UpdatePersonalMaintenanceItemInput,
  ): Promise<Car> {
    const car = await assertPersonalCar(ownerId, carId);
    const item = car.personalMaintenanceChecklist?.find(
      (entry) => entry._id.toString() === itemId,
    );

    if (!item) {
      throw new NotFoundError('Maintenance item not found');
    }

    const scheduleType = input.scheduleType ?? item.scheduleType;

    if (scheduleType === 'time' && input.frequency === undefined && !item.frequency) {
      throw new ValidationError('Frequency is required for time-based items');
    }

    if (
      scheduleType === 'mileage' &&
      input.mileageIntervalKm === undefined &&
      item.mileageIntervalKm == null
    ) {
      throw new ValidationError('Mileage interval is required for mileage-based items');
    }

    const parsedLastCompletedAt =
      input.lastCompletedAt === undefined
        ? undefined
        : input.lastCompletedAt
          ? parseMaintenanceDate(input.lastCompletedAt)
          : null;

    let lastCompletedOdometerKm: number | null | undefined;

    if (scheduleType === 'mileage') {
      if (input.lastCompletedOdometerKm !== undefined) {
        lastCompletedOdometerKm = input.lastCompletedOdometerKm;
      } else if (parsedLastCompletedAt) {
        lastCompletedOdometerKm = car.personalCurrentOdometerKm ?? 0;
      }
    }

    const updated = await carsRepository.updatePersonalMaintenanceItem(carId, itemId, {
      scheduleType: input.scheduleType,
      frequency:
        input.scheduleType === 'mileage'
          ? null
          : input.frequency ?? (input.scheduleType === 'time' ? item.frequency : undefined),
      mileageIntervalKm:
        input.scheduleType === 'time'
          ? null
          : input.mileageIntervalKm ??
            (input.scheduleType === 'mileage' ? item.mileageIntervalKm : undefined),
      lastCompletedAt: parsedLastCompletedAt,
      lastCompletedOdometerKm,
    });

    if (!updated) {
      throw new NotFoundError('Maintenance item not found');
    }

    if (parsedLastCompletedAt !== undefined) {
      await notificationRemindersService.resetMaintenanceReminders(carId, itemId);
    }

    return toCar(updated);
  },

  async completePersonalMaintenanceItem(
    ownerId: string,
    carId: string,
    itemId: string,
    input: { cost: number; personalCurrentOdometerKm?: number },
  ): Promise<Car> {
    const car = await assertPersonalCar(ownerId, carId);
    const item = car.personalMaintenanceChecklist?.find(
      (entry) => entry._id.toString() === itemId,
    );

    if (!item) {
      throw new NotFoundError('Maintenance item not found');
    }

    const completedAt = new Date();
    let updated: CarDocument | null;

    if (item.scheduleType === 'time') {
      updated = await carsRepository.completePersonalTimeItem(carId, itemId, completedAt);
    } else {
      if (input.personalCurrentOdometerKm == null) {
        throw new ValidationError('Odometer is required for mileage-based items');
      }

      if (isDuplicateMileageCompletion(item, input.personalCurrentOdometerKm, completedAt)) {
        throw new ValidationError(DUPLICATE_MILEAGE_COMPLETION_MESSAGE);
      }

      updated = await carsRepository.completePersonalMileageItem(
        carId,
        itemId,
        completedAt,
        input.personalCurrentOdometerKm,
      );
    }

    if (!updated) {
      throw new NotFoundError('Maintenance item not found');
    }

    if (input.cost > 0) {
      await expensesService.createRunningCostExpense(ownerId, {
        carId,
        maintenanceItemId: itemId,
        title: item.title,
        amount: input.cost,
        expenseDate: completedAt.toISOString(),
      });
    }

    await notificationRemindersService.resetMaintenanceReminders(carId, itemId);

    return toCar(updated);
  },
};
