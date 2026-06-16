import { Schema, model } from 'mongoose';

import { MAINTENANCE_REMINDER_KEYS } from '../features/notification-reminders/notification-reminders.types';

const maintenanceReminderLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    maintenanceItemId: { type: Schema.Types.ObjectId, required: true, index: true },
    reminderKey: { type: String, enum: MAINTENANCE_REMINDER_KEYS, required: true },
    lastSentAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

maintenanceReminderLogSchema.index(
  { carId: 1, maintenanceItemId: 1, reminderKey: 1 },
  { unique: true },
);

export const MaintenanceReminderLogModel = model(
  'MaintenanceReminderLog',
  maintenanceReminderLogSchema,
);
