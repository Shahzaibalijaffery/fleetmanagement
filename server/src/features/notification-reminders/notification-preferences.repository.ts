import { NotificationPreferencesModel } from '../../models/notification-preferences.model';

import type {
  ExpenseReminderSlot,
  NotificationPreferencesRecord,
  UpdateNotificationPreferencesInput,
} from './notification-reminders.types';
import { EXPENSE_REMINDER_SLOT_CONFIGS, getExpenseReminderSlotConfig } from './notification-reminders.types';

const EXPENSE_REMINDER_SENT_FIELDS = EXPENSE_REMINDER_SLOT_CONFIGS.map((entry) => entry.sentAtField);

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

  async markExpenseReminderSent(userId: string, slot: ExpenseReminderSlot, sentAt: Date) {
    const field = getExpenseReminderSlotConfig(slot).sentAtField;

    await NotificationPreferencesModel.findOneAndUpdate(
      { userId },
      { [field]: sentAt },
      { upsert: true, setDefaultsOnInsert: true },
    );
  },

  async getExpenseReminderSentAt(userId: string, slot: ExpenseReminderSlot) {
    const field = getExpenseReminderSlotConfig(slot).sentAtField;
    const doc = await NotificationPreferencesModel.findOne({ userId }).select(field).lean();

    if (!doc) {
      return null;
    }

    return doc[field as keyof typeof doc] as Date | null | undefined ?? null;
  },

  async getMostRecentExpenseReminderSentAt(userId: string) {
    const selectFields = EXPENSE_REMINDER_SENT_FIELDS.join(' ');
    const doc = await NotificationPreferencesModel.findOne({ userId }).select(selectFields).lean();

    if (!doc) {
      return null;
    }

    const timestamps = EXPENSE_REMINDER_SENT_FIELDS.map((field) => doc[field as keyof typeof doc])
      .filter((value): value is Date => value instanceof Date);

    if (timestamps.length === 0) {
      return null;
    }

    return timestamps.reduce((latest, current) =>
      current.getTime() > latest.getTime() ? current : latest,
    );
  },

  async markExpenseReminderSentAt(userId: string, sentAt: Date) {
    const update = Object.fromEntries(
      EXPENSE_REMINDER_SENT_FIELDS.map((field) => [field, sentAt]),
    );

    await NotificationPreferencesModel.findOneAndUpdate(
      { userId },
      update,
      { upsert: true, setDefaultsOnInsert: true },
    );
  },
};
