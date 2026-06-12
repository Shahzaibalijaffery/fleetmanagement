import { Schema, model } from 'mongoose';

const carExpenseItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: true },
);

const carExpenseLogSchema = new Schema(
  {
    carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expenseDate: { type: Date, required: true, index: true },
    visitTitle: { type: String, trim: true },
    items: {
      type: [carExpenseItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => Array.isArray(items) && items.length > 0,
        message: 'At least one expense item is required',
      },
    },
  },
  {
    timestamps: true,
  },
);

carExpenseLogSchema.index({ carId: 1, expenseDate: -1, createdAt: -1 });

export const CarExpenseLogModel = model('CarExpenseLog', carExpenseLogSchema);
