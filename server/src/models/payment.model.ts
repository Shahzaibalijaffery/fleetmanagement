import { Schema, model } from 'mongoose';

import { PAYMENT_STATUSES } from '../features/payments/payments.types';

const paymentSchema = new Schema(
  {
    contractId: { type: Schema.Types.ObjectId, ref: 'Contract', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: PAYMENT_STATUSES, required: true, default: 'pending' },
    paidAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({ ownerId: 1, status: 1, dueDate: 1 });
paymentSchema.index({ driverId: 1, status: 1, dueDate: 1 });

export const PaymentModel = model('Payment', paymentSchema);
