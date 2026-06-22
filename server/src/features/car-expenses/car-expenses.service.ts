import { expenseDeletionLogService } from '../../shared/services/expense-deletion-log.service';
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/AppError';
import { buildMeta } from '../../shared/types/pagination.types';
import { carsRepository } from '../cars/cars.repository';

import { carExpensesRepository } from './car-expenses.repository';
import type {
  AddCarExpenseItemInput,
  CarExpenseLog,
  CarExpenseLogDocument,
  CreateCarExpenseLogInput,
  ListCarExpensesQuery,
  UpdateCarExpenseItemInput,
  UpdateCarExpenseLogInput,
} from './car-expenses.types';

function sumItems(items: { amount: number }[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

function toExpenseLog(log: CarExpenseLogDocument): CarExpenseLog {
  const items = log.items.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    amount: item.amount,
  }));

  return {
    id: log._id.toString(),
    carId: log.carId.toString(),
    ownerId: log.ownerId.toString(),
    expenseDate: log.expenseDate,
    visitTitle: log.visitTitle,
    items,
    totalAmount: sumItems(items),
    createdAt: log.createdAt,
    updatedAt: log.updatedAt,
  };
}

async function assertPersonalCarAccess(ownerId: string, carId: string) {
  const car = await carsRepository.findById(carId);

  if (!car) {
    throw new NotFoundError('Car not found');
  }

  if (car.ownerId.toString() !== ownerId) {
    throw new ForbiddenError('Access denied');
  }

  if (car.status !== 'personal_use') {
    throw new ValidationError('Repair expenses can only be tracked for personal use cars');
  }

  return car;
}

async function getOwnedLog(ownerId: string, carId: string, logId: string) {
  await assertPersonalCarAccess(ownerId, carId);

  const log = await carExpensesRepository.findById(logId);

  if (!log || log.carId.toString() !== carId) {
    throw new NotFoundError('Expense log not found');
  }

  if (log.ownerId.toString() !== ownerId) {
    throw new ForbiddenError('Access denied');
  }

  return log as CarExpenseLogDocument;
}

export const carExpensesService = {
  async listExpenses(ownerId: string, carId: string, query: ListCarExpensesQuery) {
    await assertPersonalCarAccess(ownerId, carId);

    const skip = (query.page - 1) * query.limit;
    const [logs, total, totalResult] = await Promise.all([
      carExpensesRepository.findPaginated(carId, skip, query.limit),
      carExpensesRepository.countByCarId(carId),
      carExpensesRepository.sumTotalByCarId(carId),
    ]);

    const totalSpent = totalResult[0]?.total ?? 0;

    return {
      data: logs.map((log) => toExpenseLog(log as CarExpenseLogDocument)),
      meta: buildMeta(query.page, query.limit, total),
      totalSpent,
    };
  },

  async createExpense(ownerId: string, carId: string, input: CreateCarExpenseLogInput) {
    await assertPersonalCarAccess(ownerId, carId);

    const log = await carExpensesRepository.create(carId, ownerId, input);
    return toExpenseLog(log.toObject() as CarExpenseLogDocument);
  },

  async updateExpense(
    ownerId: string,
    carId: string,
    logId: string,
    input: UpdateCarExpenseLogInput,
  ) {
    await getOwnedLog(ownerId, carId, logId);
    const log = await carExpensesRepository.updateById(logId, input);

    if (!log) {
      throw new NotFoundError('Expense log not found');
    }

    return toExpenseLog(log as CarExpenseLogDocument);
  },

  async addExpenseItem(
    ownerId: string,
    carId: string,
    logId: string,
    input: AddCarExpenseItemInput,
  ) {
    await getOwnedLog(ownerId, carId, logId);

    const log = await carExpensesRepository.addItem(logId, input);

    if (!log) {
      throw new NotFoundError('Expense log not found');
    }

    return toExpenseLog(log as CarExpenseLogDocument);
  },

  async updateExpenseItem(
    ownerId: string,
    carId: string,
    logId: string,
    itemId: string,
    input: UpdateCarExpenseItemInput,
  ) {
    const existing = await getOwnedLog(ownerId, carId, logId);
    const itemExists = existing.items.some((item) => item._id.toString() === itemId);

    if (!itemExists) {
      throw new NotFoundError('Expense item not found');
    }

    if (input.title === undefined && input.amount === undefined) {
      throw new ValidationError('At least one field is required');
    }

    const log = await carExpensesRepository.updateItem(logId, itemId, input);

    if (!log) {
      throw new NotFoundError('Expense item not found');
    }

    return toExpenseLog(log as CarExpenseLogDocument);
  },

  async removeExpenseItem(ownerId: string, carId: string, logId: string, itemId: string) {
    const existing = await getOwnedLog(ownerId, carId, logId);
    const item = existing.items.find((entry) => entry._id.toString() === itemId);

    if (!item) {
      throw new NotFoundError('Expense item not found');
    }

    if (existing.items.length <= 1) {
      await expenseDeletionLogService.recordCarLogDeletion(ownerId, existing);
      await carExpensesRepository.deleteById(logId);
      return null;
    }

    await expenseDeletionLogService.recordCarLogItemDeletion(ownerId, existing, item);

    const log = await carExpensesRepository.removeItem(logId, itemId);

    if (!log) {
      throw new NotFoundError('Expense log not found');
    }

    return toExpenseLog(log as CarExpenseLogDocument);
  },

  async deleteExpense(ownerId: string, carId: string, logId: string) {
    const log = await getOwnedLog(ownerId, carId, logId);
    await expenseDeletionLogService.recordCarLogDeletion(ownerId, log);
    await carExpensesRepository.deleteById(logId);
  },
};
