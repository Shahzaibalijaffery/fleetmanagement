import { Schema, model } from 'mongoose';

import { REQUEST_STATUSES } from '../features/requests/requests.types';

const carRequestSchema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: REQUEST_STATUSES, required: true, default: 'pending' },
  },
  {
    timestamps: true,
  },
);

carRequestSchema.index({ driverId: 1, status: 1, createdAt: -1 });
carRequestSchema.index({ ownerId: 1, status: 1, createdAt: -1 });
carRequestSchema.index(
  { carId: 1, driverId: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } },
);

export const CarRequestModel = model('CarRequest', carRequestSchema);
