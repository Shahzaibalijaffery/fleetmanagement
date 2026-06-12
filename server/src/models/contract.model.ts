import { Schema, model } from 'mongoose';

import {
  CONTRACT_MODES,
  CONTRACT_STATUSES,
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SCHEDULE_TYPES,
  PAYMENT_FREQUENCIES,
  RESPONSIBILITY_PARTIES,
} from '../features/contracts/contracts.types';

const maintenanceChecklistItemSchema = new Schema(
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

const contractSchema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contractMode: { type: String, enum: CONTRACT_MODES, required: true },
    paymentFrequency: { type: String, enum: PAYMENT_FREQUENCIES, required: true },
    rentAmount: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    fuelResponsibility: { type: String, enum: RESPONSIBILITY_PARTIES, required: true },
    maintenanceResponsibility: { type: String, enum: RESPONSIBILITY_PARTIES, required: true },
    damageResponsibility: { type: String, enum: RESPONSIBILITY_PARTIES, required: true },
    status: { type: String, enum: CONTRACT_STATUSES, required: true, default: 'active' },
    initialOdometerKm: { type: Number, required: true, min: 0, default: 0 },
    currentOdometerKm: { type: Number, required: true, min: 0, default: 0 },
    maintenanceChecklist: { type: [maintenanceChecklistItemSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

contractSchema.index({ driverId: 1, status: 1, createdAt: -1 });
contractSchema.index({ ownerId: 1, status: 1, createdAt: -1 });
contractSchema.index(
  { assignmentId: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } },
);

export const ContractModel = model('Contract', contractSchema);
