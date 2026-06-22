import { Schema, model } from 'mongoose';

export const EXPENSE_DELETION_RECORD_TYPES = [
  'general',
  'running_cost',
  'car_log',
  'car_log_item',
] as const;

export type ExpenseDeletionRecordType = (typeof EXPENSE_DELETION_RECORD_TYPES)[number];

const expenseDeletionLogSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recordType: {
      type: String,
      enum: EXPENSE_DELETION_RECORD_TYPES,
      required: true,
    },
    recordId: { type: String, required: true },
    parentRecordId: { type: String, default: null },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    expenseDate: { type: Date, required: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Car', default: null },
    visitTitle: { type: String, trim: true },
    snapshot: { type: Schema.Types.Mixed, required: true },
    deletedAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: false },
);

expenseDeletionLogSchema.index({ ownerId: 1, deletedAt: -1 });

export const ExpenseDeletionLogModel = model('ExpenseDeletionLog', expenseDeletionLogSchema);
