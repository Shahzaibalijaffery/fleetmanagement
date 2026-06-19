import { env } from '../../config/env';
import { sendPushToUser } from '../push-notifications/push-notifications.dispatcher';

import { maintenanceReminderLogRepository } from './maintenance-reminder-log.repository';
import { logNotification, logNotificationSent, logNotificationSkip } from './notification-reminders.logger';
import { notificationPreferencesRepository } from './notification-preferences.repository';
import { notificationRemindersRepository } from './notification-reminders.repository';
import {
  getExpenseReminderSlotConfig,
  type ExpenseReminderSlot,
} from './expense-reminder-times.config';
import {
  MAINTENANCE_REMINDER_RULES,
  type MaintenanceReminderKey,
  type NotificationPreferencesRecord,
} from './notification-reminders.types';
import {
  canSendMaintenanceReminder,
  daysSince,
  getActiveExpenseReminderSlot,
  getExpenseReminderSlotLabels,
  isSameLocalDay,
} from './notification-reminders.utils';

export interface ProcessRemindersOptions {
  source?: 'scheduler' | 'health-test' | 'manual';
  testExpenseSlot?: ExpenseReminderSlot;
  testForce?: boolean;
}

export interface ProcessRemindersSummary {
  source: string;
  expenseChecked: number;
  expenseSent: number;
  maintenanceSent: number;
  durationMs: number;
}

let isProcessingReminders = false;

function getMaintenanceTitle(ruleKey: MaintenanceReminderKey): string {
  switch (ruleKey) {
    case 'oil_change':
      return 'Oil change';
    case 'car_wash':
      return 'Car wash';
    default:
      return 'General service';
  }
}

type ContractMaintenanceReminderTarget = {
  ownerId: { toString(): string };
  driverId: { toString(): string };
  startDate: Date;
  carId: {
    _id: { toString(): string };
    brand: string;
    model: string;
    registrationNumber: string;
  };
  maintenanceChecklist: Array<{
    _id: { toString(): string };
    title: string;
    lastCompletedAt: Date | null | undefined;
  }>;
};

async function sendExpenseReminder(
  ownerId: string,
  body: string,
  slot: ExpenseReminderSlot,
) {
  const result = await sendPushToUser(ownerId, {
    type: 'expense_reminder',
    title: 'Add today’s expenses',
    body,
    data: {
      reminderSlot: slot,
    },
  });

  if (result.skipped) {
    logNotificationSkip('push', 'expense reminder not delivered', {
      userId: ownerId,
      slot,
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
    return false;
  }

  logNotificationSent('expense', {
    userId: ownerId,
    slot,
    successCount: result.successCount,
    failureCount: result.failureCount,
  });

  return result.successCount > 0;
}

async function sendMaintenanceReminder(
  userId: string,
  title: string,
  body: string,
  data: Record<string, string>,
) {
  const result = await sendPushToUser(userId, {
    type: 'maintenance_due',
    title,
    body,
    data,
  });

  if (result.skipped) {
    logNotificationSkip('push', 'maintenance reminder not delivered', {
      userId,
      ...data,
    });
    return false;
  }

  logNotificationSent('maintenance', {
    userId,
    ...data,
    successCount: result.successCount,
    failureCount: result.failureCount,
  });

  return result.successCount > 0;
}

export const notificationRemindersService = {
  getPreferences(userId: string) {
    return notificationPreferencesRepository.getOrCreate(userId);
  },

  updatePreferences(userId: string, input: Parameters<typeof notificationPreferencesRepository.updateByUserId>[1]) {
    return notificationPreferencesRepository.updateByUserId(userId, input);
  },

  async resetMaintenanceReminders(carId: string, maintenanceItemId: string) {
    await maintenanceReminderLogRepository.deleteByCarAndItem(carId, maintenanceItemId);
  },

  async processReminders(options?: ProcessRemindersOptions): Promise<ProcessRemindersSummary | null> {
    if (isProcessingReminders) {
      logNotificationSkip('expense', 'already processing reminders');
      return null;
    }

    isProcessingReminders = true;
    const startedAt = Date.now();
    const source = options?.source ?? 'manual';

    logNotification('Run started', {
      source,
      testMode: env.NOTIFICATION_TEST_MODE,
      testExpenseSlot: options?.testExpenseSlot ?? null,
      testForce: options?.testForce ?? false,
    });

    const summary: ProcessRemindersSummary = {
      source,
      expenseChecked: 0,
      expenseSent: 0,
      maintenanceSent: 0,
      durationMs: 0,
    };

    try {
      const expenseResult = await this.processExpenseReminders(options);
      summary.expenseChecked = expenseResult.checked;
      summary.expenseSent = expenseResult.sent;

      summary.maintenanceSent = await this.processMaintenanceReminders();
    } finally {
      isProcessingReminders = false;
      summary.durationMs = Date.now() - startedAt;

      logNotification('Run finished', { ...summary });
    }

    return summary;
  },

  async processExpenseReminders(options?: ProcessRemindersOptions) {
    const now = new Date();
    let checked = 0;
    let sent = 0;

    const slot = options?.testExpenseSlot ?? getActiveExpenseReminderSlot(now);

    if (!slot) {
      logNotificationSkip('expense', 'outside reminder windows', {
        timezone: env.NOTIFICATION_TIMEZONE,
        now: now.toISOString(),
        windows: getExpenseReminderSlotLabels(),
      });
      return { checked, sent };
    }

    const timeLabel = getExpenseReminderSlotConfig(slot).label;
    const owners = await notificationRemindersRepository.findOwnerIds();
    checked = owners.length;

    logNotification(`Expense slot mode — hour ${slot}`, { ownerCount: owners.length, timeLabel });

    for (const owner of owners) {
      const ownerId = owner._id.toString();
      const preferences = await notificationPreferencesRepository.getOrCreate(ownerId);

      if (!preferences.dailyExpenseReminders) {
        logNotificationSkip('expense', 'reminders disabled', { userId: ownerId });
        continue;
      }

      const lastSentAt = await notificationPreferencesRepository.getExpenseReminderSentAt(ownerId, slot);

      if (!options?.testForce && lastSentAt && isSameLocalDay(lastSentAt, now)) {
        logNotificationSkip('expense', 'already sent today for slot', {
          userId: ownerId,
          slot,
          lastSentAt: lastSentAt.toISOString(),
        });
        continue;
      }

      const delivered = await sendExpenseReminder(
        ownerId,
        `Reminder to log today’s expenses in FleetLink (${timeLabel}).`,
        slot,
      );

      if (delivered) {
        await notificationPreferencesRepository.markExpenseReminderSent(ownerId, slot, now);
        sent += 1;
      }
    }

    return { checked, sent };
  },

  async processMaintenanceReminders() {
    const now = new Date();
    let sent = 0;

    const cars = await notificationRemindersRepository.findPersonalUseCars();

    logNotification('Maintenance check — personal cars', { carCount: cars.length });

    for (const car of cars) {
      const ownerId = car.ownerId.toString();
      const preferences = await notificationPreferencesRepository.getOrCreate(ownerId);

      for (const item of car.personalMaintenanceChecklist ?? []) {
        const itemId = item._id.toString();
        const rule = MAINTENANCE_REMINDER_RULES.find((entry) => entry.matchesTitle(item.title));

        if (!rule || !preferences[rule.preferenceField]) {
          continue;
        }

        const anchorDate = item.lastCompletedAt ?? car.createdAt;
        const overdueDays = daysSince(anchorDate, now);

        if (overdueDays < rule.dueAfterDays) {
          continue;
        }

        const log = await maintenanceReminderLogRepository.findByTarget(
          ownerId,
          car._id.toString(),
          itemId,
          rule.key,
        );

        if (!canSendMaintenanceReminder(log?.lastSentAt, now, rule.repeatEveryDays)) {
          continue;
        }

        const title = getMaintenanceTitle(rule.key);
        const carLabel = `${car.brand} ${car.model}`.trim();

        const delivered = await sendMaintenanceReminder(
          ownerId,
          `${title} reminder`,
          `${carLabel} (${car.registrationNumber}) — update ${item.title.toLowerCase()} in FleetLink.`,
          {
            carId: car._id.toString(),
            maintenanceItemId: itemId,
            maintenanceType: rule.key,
          },
        );

        if (delivered) {
          await maintenanceReminderLogRepository.upsertSent(
            ownerId,
            car._id.toString(),
            itemId,
            rule.key,
            now,
          );
          sent += 1;
        }
      }
    }

    const contracts = (await notificationRemindersRepository.findActiveContractsForMaintenanceReminders()) as unknown as
      ContractMaintenanceReminderTarget[];

    logNotification('Maintenance check — contract cars', { contractCount: contracts.length });

    for (const contract of contracts) {
      const ownerId = contract.ownerId.toString();
      const driverId = contract.driverId.toString();
      const carId = contract.carId._id.toString();
      const carLabel = `${contract.carId.brand} ${contract.carId.model}`.trim();
      const registrationNumber = contract.carId.registrationNumber;

      const [ownerPrefs, driverPrefs] = await Promise.all([
        notificationPreferencesRepository.getOrCreate(ownerId),
        notificationPreferencesRepository.getOrCreate(driverId),
      ]);

      for (const item of contract.maintenanceChecklist ?? []) {
        const itemId = item._id.toString();
        const rule = MAINTENANCE_REMINDER_RULES.find((entry) => entry.matchesTitle(item.title));

        if (!rule) {
          continue;
        }

        const anchorDate = item.lastCompletedAt ?? contract.startDate;
        const overdueDays = daysSince(anchorDate, now);

        if (overdueDays < rule.dueAfterDays) {
          continue;
        }

        if (ownerPrefs[rule.preferenceField]) {
          const log = await maintenanceReminderLogRepository.findByTarget(
            ownerId,
            carId,
            itemId,
            rule.key,
          );

          if (canSendMaintenanceReminder(log?.lastSentAt, now, rule.repeatEveryDays)) {
            const title = getMaintenanceTitle(rule.key);

            const delivered = await sendMaintenanceReminder(
              ownerId,
              `${title} reminder`,
              `${carLabel} (${registrationNumber}) — update ${item.title.toLowerCase()} in FleetLink.`,
              {
                carId,
                maintenanceItemId: itemId,
                maintenanceType: rule.key,
              },
            );

            if (delivered) {
              await maintenanceReminderLogRepository.upsertSent(
                ownerId,
                carId,
                itemId,
                rule.key,
                now,
              );
              sent += 1;
            }
          }
        }

        if (driverPrefs[rule.preferenceField]) {
          const log = await maintenanceReminderLogRepository.findByTarget(
            driverId,
            carId,
            itemId,
            rule.key,
          );

          if (canSendMaintenanceReminder(log?.lastSentAt, now, rule.repeatEveryDays)) {
            const title = getMaintenanceTitle(rule.key);

            const delivered = await sendMaintenanceReminder(
              driverId,
              `${title} reminder`,
              `${carLabel} (${registrationNumber}) — update ${item.title.toLowerCase()} in FleetLink.`,
              {
                carId,
                maintenanceItemId: itemId,
                maintenanceType: rule.key,
              },
            );

            if (delivered) {
              await maintenanceReminderLogRepository.upsertSent(
                driverId,
                carId,
                itemId,
                rule.key,
                now,
              );
              sent += 1;
            }
          }
        }
      }
    }

    return sent;
  },
};

export type { NotificationPreferencesRecord };
