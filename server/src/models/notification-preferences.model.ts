import { Schema, model } from 'mongoose';

const notificationPreferencesSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    dailyExpenseReminders: { type: Boolean, required: true, default: true },
    oilChangeReminders: { type: Boolean, required: true, default: true },
    carWashReminders: { type: Boolean, required: true, default: true },
    generalServiceReminders: { type: Boolean, required: true, default: true },
    lastExpenseReminderSlot22At: { type: Date, default: null },
    lastExpenseReminderSlot23At: { type: Date, default: null },
    lastExpenseReminderSlot0030At: { type: Date, default: null },
    lastExpenseReminderSlot01At: { type: Date, default: null },
  },
  { timestamps: true },
);

export const NotificationPreferencesModel = model(
  'NotificationPreferences',
  notificationPreferencesSchema,
);
