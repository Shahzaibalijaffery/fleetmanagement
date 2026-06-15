import { Schema, model } from 'mongoose';

const monthlySalarySchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    year: { type: Number, required: true, min: 2000, max: 2100 },
    month: { type: Number, required: true, min: 1, max: 12 },
    amount: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  },
);

monthlySalarySchema.index({ ownerId: 1, year: 1, month: 1 }, { unique: true });

export const MonthlySalaryModel = model('MonthlySalary', monthlySalarySchema);
