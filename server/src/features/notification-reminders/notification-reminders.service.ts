import { sendPushToUser } from '../push-notifications/push-notifications.dispatcher';

import { maintenanceReminderLogRepository } from './maintenance-reminder-log.repository';
import { notificationPreferencesRepository } from './notification-preferences.repository';
import { notificationRemindersRepository } from './notification-reminders.repository';
import {
  MAINTENANCE_REMINDER_RULES,
  type DailyExpenseReminderSlot,
  type MaintenanceReminderKey,
  type NotificationPreferencesRecord,
} from './notification-reminders.types';
import {
  daysSince,
  daysSinceLastSent,
  getLocalDayRange,
} from './notification-reminders.utils';

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

  async sendDailyExpenseReminders(slot: DailyExpenseReminderSlot) {
    const owners = await notificationRemindersRepository.findOwnerIds();
    const { start, end } = getLocalDayRange();
    const timeLabel = slot === '22' ? '10:00 PM' : '11:00 PM';

    for (const owner of owners) {
      const ownerId = owner._id.toString();
      const preferences = await notificationPreferencesRepository.getOrCreate(ownerId);

      if (!preferences.dailyExpenseReminders) {
        continue;
      }

      const hasExpenseToday = await notificationRemindersRepository.hasGeneralExpenseInRange(
        ownerId,
        start,
        end,
      );

      if (hasExpenseToday) {
        continue;
      }

      await sendPushToUser(ownerId, {
        type: 'expense_reminder',
        title: 'Add today’s expenses',
        body: `You have not logged any expenses today. Add them before the day ends (${timeLabel} reminder).`,
        data: {
          reminderSlot: slot,
        },
      });
    }
  },

  async sendMaintenanceReminders() {
    const cars = await notificationRemindersRepository.findPersonalUseCars();
    const now = new Date();

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
          car._id.toString(),
          itemId,
          rule.key,
        );

        if (log && daysSinceLastSent(log.lastSentAt, now) < rule.repeatEveryDays) {
          continue;
        }

        const title = getMaintenanceTitle(rule.key);
        const carLabel = `${car.brand} ${car.model}`.trim();

        await sendPushToUser(ownerId, {
          type: 'maintenance_due',
          title: `${title} reminder`,
          body: `${carLabel} (${car.registrationNumber}) — update ${item.title.toLowerCase()} in FleetLink.`,
          data: {
            carId: car._id.toString(),
            maintenanceItemId: itemId,
            maintenanceType: rule.key,
          },
        });

        await maintenanceReminderLogRepository.upsertSent(
          ownerId,
          car._id.toString(),
          itemId,
          rule.key,
          now,
        );
      }
    }
  },
};

export type { NotificationPreferencesRecord };
