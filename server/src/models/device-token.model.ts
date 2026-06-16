import { Schema, model } from 'mongoose';

import { PUSH_PLATFORMS } from '../features/push-notifications/push-notifications.types';

const deviceTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, trim: true },
    platform: { type: String, enum: PUSH_PLATFORMS, required: true },
    deviceId: { type: String, trim: true, default: null },
    lastUsedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

deviceTokenSchema.index({ token: 1 }, { unique: true });
deviceTokenSchema.index({ userId: 1, platform: 1 });

export const DeviceTokenModel = model('DeviceToken', deviceTokenSchema);
