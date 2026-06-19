import { NotificationPreferencesModel } from '../../models/notification-preferences.model';

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

  async markExpenseReminderSent(userId: string, slot: '22' | '23', sentAt: Date) {
    const field = slot === '22' ? 'lastExpenseReminderSlot22At' : 'lastExpenseReminderSlot23At';

    await NotificationPreferencesModel.findOneAndUpdate(
      { userId },
      { [field]: sentAt },
      { upsert: true, setDefaultsOnInsert: true },
    );
  },

  async getExpenseReminderSentAt(userId: string, slot: '22' | '23') {
    const field = slot === '22' ? 'lastExpenseReminderSlot22At' : 'lastExpenseReminderSlot23At';
    const doc = await NotificationPreferencesModel.findOne({ userId }).select(field).lean();

    if (!doc) {
      return null;
    }

    return slot === '22' ? doc.lastExpenseReminderSlot22At ?? null : doc.lastExpenseReminderSlot23At ?? null;
  },

  async getMostRecentExpenseReminderSentAt(userId: string) {
    const doc = await NotificationPreferencesModel.findOne({ userId })
      .select('lastExpenseReminderSlot22At lastExpenseReminderSlot23At')
      .lean();

    if (!doc) {
      return null;
    }

    const timestamps = [doc.lastExpenseReminderSlot22At, doc.lastExpenseReminderSlot23At].filter(
      (value): value is Date => value instanceof Date,
    );

    if (timestamps.length === 0) {
      return null;
    }

    return timestamps.reduce((latest, current) =>
      current.getTime() > latest.getTime() ? current : latest,
    );
  },

  async markExpenseReminderSentAt(userId: string, sentAt: Date) {
    await NotificationPreferencesModel.findOneAndUpdate(
      { userId },
      {
        lastExpenseReminderSlot22At: sentAt,
        lastExpenseReminderSlot23At: sentAt,
      },
      { upsert: true, setDefaultsOnInsert: true },
    );
  },
};
