import { Types } from 'mongoose';

import { CarExpenseLogModel } from '../../models/car-expense-log.model';

import type {
  AddCarExpenseItemInput,
  CarExpenseItemInput,
  CreateCarExpenseLogInput,
  UpdateCarExpenseLogInput,
} from './car-expenses.types';

function parseExpenseDate(value: string): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid expense date');
  }

  return date;
}

function sumItems(items: { amount: number }[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

export const carExpensesRepository = {
  findPaginated(carId: string, skip: number, limit: number) {
    return CarExpenseLogModel.find({ carId })
      .sort({ expenseDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  },

  countByCarId(carId: string) {
    return CarExpenseLogModel.countDocuments({ carId });
  },

  sumTotalByCarId(carId: string) {
    return CarExpenseLogModel.aggregate<{ total: number }>([
      { $match: { carId: new Types.ObjectId(carId) } },
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.amount' } } },
    ]);
  },

  findByOwnerIdInRange(ownerId: string, start: Date, end: Date) {
    return CarExpenseLogModel.find({
      ownerId,
      expenseDate: { $gte: start, $lt: end },
    })
      .populate('carId', 'brand model registrationNumber')
      .sort({ expenseDate: -1, createdAt: -1 })
      .lean();
  },

  sumTotalByOwnerIdInRange(ownerId: string, start: Date, end: Date) {
    return CarExpenseLogModel.aggregate<{ total: number }>([
      {
        $match: {
          ownerId: new Types.ObjectId(ownerId),
          expenseDate: { $gte: start, $lt: end },
        },
      },
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.amount' } } },
    ]);
  },

  findById(logId: string) {
    return CarExpenseLogModel.findById(logId).lean();
  },

  create(carId: string, ownerId: string, input: CreateCarExpenseLogInput) {
    return CarExpenseLogModel.create({
      carId,
      ownerId,
      expenseDate: parseExpenseDate(input.expenseDate),
      visitTitle: input.visitTitle?.trim() || undefined,
      items: input.items.map((item) => ({
        title: item.title.trim(),
        amount: item.amount,
      })),
    });
  },

  updateById(logId: string, input: UpdateCarExpenseLogInput) {
    const update: Record<string, unknown> = {};

    if (input.expenseDate) {
      update.expenseDate = parseExpenseDate(input.expenseDate);
    }

    if (input.visitTitle !== undefined) {
      const trimmed = input.visitTitle.trim();
      update.visitTitle = trimmed || undefined;
    }

    return CarExpenseLogModel.findByIdAndUpdate(logId, update, { new: true }).lean();
  },

  addItem(logId: string, input: AddCarExpenseItemInput) {
    return CarExpenseLogModel.findByIdAndUpdate(
      logId,
      {
        $push: {
          items: {
            title: input.title.trim(),
            amount: input.amount,
          },
        },
      },
      { new: true },
    ).lean();
  },

  removeItem(logId: string, itemId: string) {
    return CarExpenseLogModel.findByIdAndUpdate(
      logId,
      { $pull: { items: { _id: itemId } } },
      { new: true },
    ).lean();
  },

  updateItem(logId: string, itemId: string, input: { title?: string; amount?: number }) {
    const update: Record<string, unknown> = {};

    if (input.title !== undefined) {
      update['items.$.title'] = input.title.trim();
    }

    if (input.amount !== undefined) {
      update['items.$.amount'] = input.amount;
    }

    if (Object.keys(update).length === 0) {
      return this.findById(logId);
    }

    return CarExpenseLogModel.findOneAndUpdate(
      { _id: logId, 'items._id': itemId },
      { $set: update },
      { new: true },
    ).lean();
  },

  deleteById(logId: string) {
    return CarExpenseLogModel.findByIdAndDelete(logId);
  },

  deleteByCarId(carId: string) {
    return CarExpenseLogModel.deleteMany({ carId });
  },

  sumLogItems(items: CarExpenseItemInput[]) {
    return sumItems(items);
  },
};
