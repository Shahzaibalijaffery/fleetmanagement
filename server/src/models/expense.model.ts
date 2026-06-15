import { Schema, model } from 'mongoose';

export const EXPENSE_SOURCES = ['general', 'running_cost'] as const;

const expenseSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    source: {
      type: String,
      enum: EXPENSE_SOURCES,
      required: true,
      default: 'general',
    },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    expenseDate: { type: Date, required: true, index: true },
    notes: { type: String, trim: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Car' },
    maintenanceItemId: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

expenseSchema.index({ ownerId: 1, expenseDate: -1, createdAt: -1 });
expenseSchema.index({ ownerId: 1, carId: 1, maintenanceItemId: 1 });

export const ExpenseModel = model('Expense', expenseSchema);
