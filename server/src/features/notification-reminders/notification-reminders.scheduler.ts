import cron from 'node-cron';

import { env } from '../../config/env';

import { notificationRemindersService } from './notification-reminders.service';

const timezone = env.NOTIFICATION_TIMEZONE;

export function startNotificationSchedulers() {
  cron.schedule(
    '0 22 * * *',
    () => {
      void notificationRemindersService.sendDailyExpenseReminders('22');
    },
    { timezone },
  );

  cron.schedule(
    '0 23 * * *',
    () => {
      void notificationRemindersService.sendDailyExpenseReminders('23');
    },
    { timezone },
  );

  cron.schedule(
    '0 9 * * *',
    () => {
      void notificationRemindersService.sendMaintenanceReminders();
    },
    { timezone },
  );

  console.log(`[notifications] Schedulers started (${timezone})`);
}
