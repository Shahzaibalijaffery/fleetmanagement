import { Types } from 'mongoose';

import { ExpenseModel } from '../../models/expense.model';

import type {
  CreateExpenseInput,
  CreateRunningCostExpenseInput,
  UpdateExpenseInput,
} from './expenses.types';

function parseExpenseDate(value: string): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid expense date');
  }

  return date;
}

export const expensesRepository = {
  findByOwnerIdInRange(
    ownerId: string,
    start: Date,
    end: Date,
    sources: Array<'general' | 'running_cost'>,
  ) {
    return ExpenseModel.find({
      ownerId,
      source: { $in: sources },
      expenseDate: { $gte: start, $lt: end },
    })
      .populate('carId', 'brand model registrationNumber')
      .sort({ expenseDate: -1, createdAt: -1 })
      .lean();
  },

  findById(expenseId: string) {
    return ExpenseModel.findById(expenseId).lean();
  },

  existsRunningCostForMaintenanceInRange(
    ownerId: string,
    carId: string,
    maintenanceItemId: string,
    start: Date,
    end: Date,
  ) {
    return ExpenseModel.exists({
      ownerId,
      carId,
      maintenanceItemId,
      source: 'running_cost',
      expenseDate: { $gte: start, $lt: end },
    });
  },

  create(ownerId: string, input: CreateExpenseInput) {
    return ExpenseModel.create({
      ownerId,
      source: 'general',
      title: input.title.trim(),
      amount: input.amount,
      expenseDate: parseExpenseDate(input.expenseDate),
      notes: input.notes?.trim() || undefined,
    });
  },

  createRunningCost(ownerId: string, input: CreateRunningCostExpenseInput) {
    return ExpenseModel.create({
      ownerId,
      source: 'running_cost',
      title: input.title.trim(),
      amount: input.amount,
      expenseDate: parseExpenseDate(input.expenseDate),
      carId: input.carId,
      maintenanceItemId: input.maintenanceItemId,
    });
  },

  updateById(expenseId: string, input: UpdateExpenseInput) {
    const update: Record<string, unknown> = {};

    if (input.title !== undefined) {
      update.title = input.title.trim();
    }

    if (input.amount !== undefined) {
      update.amount = input.amount;
    }

    if (input.expenseDate) {
      update.expenseDate = parseExpenseDate(input.expenseDate);
    }

    if (input.notes !== undefined) {
      const trimmed = input.notes.trim();
      update.notes = trimmed || undefined;
    }

    return ExpenseModel.findByIdAndUpdate(expenseId, update, { new: true }).lean();
  },

  deleteById(expenseId: string) {
    return ExpenseModel.findByIdAndDelete(expenseId);
  },

  sumTotalByOwnerIdInRange(
    ownerId: string,
    start: Date,
    end: Date,
    sources: Array<'general' | 'running_cost'>,
  ) {
    return ExpenseModel.aggregate<{ total: number }>([
      {
        $match: {
          ownerId: new Types.ObjectId(ownerId),
          source: { $in: sources },
          expenseDate: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
  },
};
