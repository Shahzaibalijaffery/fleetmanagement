import { Schema, model } from 'mongoose';

import { ASSIGNMENT_STATUSES } from '../features/assignments/assignments.types';

const assignmentSchema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    requestId: { type: Schema.Types.ObjectId, ref: 'CarRequest', required: true, index: true },
    status: { type: String, enum: ASSIGNMENT_STATUSES, required: true, default: 'active' },
  },
  {
    timestamps: true,
  },
);

assignmentSchema.index({ driverId: 1, status: 1, createdAt: -1 });
assignmentSchema.index({ ownerId: 1, status: 1, createdAt: -1 });
assignmentSchema.index({ carId: 1, status: 1 });
assignmentSchema.index(
  { carId: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } },
);
assignmentSchema.index(
  { driverId: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } },
);

export const AssignmentModel = model('Assignment', assignmentSchema);
