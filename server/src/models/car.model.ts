import { Schema, model } from 'mongoose';

import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SCHEDULE_TYPES,
} from '../features/contracts/contracts.types';
import { CAR_STATUSES, CAR_TYPES } from '../features/cars/cars.types';

const personalMaintenanceItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    scheduleType: { type: String, enum: MAINTENANCE_SCHEDULE_TYPES, required: true },
    frequency: { type: String, enum: MAINTENANCE_FREQUENCIES, default: null },
    mileageIntervalKm: { type: Number, min: 1, default: null },
    lastCompletedAt: { type: Date, default: null },
    lastCompletedOdometerKm: { type: Number, min: 0, default: null },
  },
  { _id: true },
);

const carSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1900, max: 2100 },
    registrationNumber: { type: String, required: true, trim: true, uppercase: true },
    city: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    carType: { type: String, enum: CAR_TYPES, required: true, default: 'sedan' },
    status: { type: String, enum: CAR_STATUSES, required: true, default: 'available' },
    personalMaintenanceChecklist: { type: [personalMaintenanceItemSchema], default: [] },
    personalInitialOdometerKm: { type: Number, min: 0, default: 0 },
    personalCurrentOdometerKm: { type: Number, min: 0, default: 0 },
  },
  {
    timestamps: true,
  },
);

carSchema.index({ ownerId: 1, status: 1, createdAt: -1 });
carSchema.index({ status: 1, city: 1, carType: 1, createdAt: -1 });
carSchema.index({ location: '2dsphere' });
carSchema.index({ registrationNumber: 1 }, { unique: true });

export const CarModel = model('Car', carSchema);
