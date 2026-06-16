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
  canSendMaintenanceReminder,
  daysSince,
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
    const now = new Date();

    const cars = await notificationRemindersRepository.findPersonalUseCars();

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

    const contracts = (await notificationRemindersRepository.findActiveContractsForMaintenanceReminders()) as unknown as
      ContractMaintenanceReminderTarget[];

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

        // Send to owner preferences
        if (ownerPrefs[rule.preferenceField]) {
          const log = await maintenanceReminderLogRepository.findByTarget(
            ownerId,
            carId,
            itemId,
            rule.key,
          );

          if (canSendMaintenanceReminder(log?.lastSentAt, now, rule.repeatEveryDays)) {
            const title = getMaintenanceTitle(rule.key);

            await sendPushToUser(ownerId, {
              type: 'maintenance_due',
              title: `${title} reminder`,
              body: `${carLabel} (${registrationNumber}) — update ${item.title.toLowerCase()} in FleetLink.`,
              data: {
                carId,
                maintenanceItemId: itemId,
                maintenanceType: rule.key,
              },
            });

            await maintenanceReminderLogRepository.upsertSent(
              ownerId,
              carId,
              itemId,
              rule.key,
              now,
            );
          }
        }

        // Send to driver preferences
        if (driverPrefs[rule.preferenceField]) {
          const log = await maintenanceReminderLogRepository.findByTarget(
            driverId,
            carId,
            itemId,
            rule.key,
          );

          if (canSendMaintenanceReminder(log?.lastSentAt, now, rule.repeatEveryDays)) {
            const title = getMaintenanceTitle(rule.key);

            await sendPushToUser(driverId, {
              type: 'maintenance_due',
              title: `${title} reminder`,
              body: `${carLabel} (${registrationNumber}) — update ${item.title.toLowerCase()} in FleetLink.`,
              data: {
                carId,
                maintenanceItemId: itemId,
                maintenanceType: rule.key,
              },
            });

            await maintenanceReminderLogRepository.upsertSent(
              driverId,
              carId,
              itemId,
              rule.key,
              now,
            );
          }
        }
      }
    }
  },
};

export type { NotificationPreferencesRecord };
