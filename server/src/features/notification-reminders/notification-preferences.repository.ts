import { NotificationPreferencesModel } from '../../models/notification-preferences.model';

import type { ExpenseReminderSlot } from './expense-reminder-times.config';
import type {
  NotificationPreferencesRecord,
  UpdateNotificationPreferencesInput,
} from './notification-reminders.types';

function toRecord(doc: {
  _id: { toString(): string };
  userId: { toString(): string };
  dailyExpenseReminders: boolean;
  oilChangeReminders: boolean;
  carWashReminders: boolean;
  generalServiceReminders: boolean;
  createdAt: Date;
  updatedAt: Date;
}): NotificationPreferencesRecord {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    dailyExpenseReminders: doc.dailyExpenseReminders,
    oilChangeReminders: doc.oilChangeReminders,
    carWashReminders: doc.carWashReminders,
    generalServiceReminders: doc.generalServiceReminders,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function readSentAt(
  sentAtMap: Map<string, Date> | Record<string, Date> | undefined,
  slot: ExpenseReminderSlot,
): Date | null {
  if (!sentAtMap) {
    return null;
  }

  const value = sentAtMap instanceof Map ? sentAtMap.get(slot) : sentAtMap[slot];

  return value instanceof Date ? value : null;
}

export const notificationPreferencesRepository = {
  async findByUserId(userId: string) {
    return NotificationPreferencesModel.findOne({ userId }).lean();
  },

  async getOrCreate(userId: string): Promise<NotificationPreferencesRecord> {
    const existing = await NotificationPreferencesModel.findOne({ userId }).lean();

    if (existing) {
      return toRecord(existing as Parameters<typeof toRecord>[0]);
    }

    const created = await NotificationPreferencesModel.create({ userId });
    return toRecord(created.toObject() as Parameters<typeof toRecord>[0]);
  },

  async updateByUserId(userId: string, input: UpdateNotificationPreferencesInput) {
    const doc = await NotificationPreferencesModel.findOneAndUpdate(
      { userId },
      input,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();

    if (!doc) {
      return null;
    }

    return toRecord(doc as Parameters<typeof toRecord>[0]);
  },

  async markExpenseReminderSent(userId: string, slot: ExpenseReminderSlot, sentAt: Date) {
    await NotificationPreferencesModel.findOneAndUpdate(
      { userId },
      { $set: { [`lastExpenseReminderSentAt.${slot}`]: sentAt } },
      { upsert: true, setDefaultsOnInsert: true },
    );
  },

  async getExpenseReminderSentAt(userId: string, slot: ExpenseReminderSlot) {
    const doc = await NotificationPreferencesModel.findOne({ userId })
      .select('lastExpenseReminderSentAt')
      .lean();

    if (!doc) {
      return null;
    }

    return readSentAt(doc.lastExpenseReminderSentAt, slot);
  },
};
