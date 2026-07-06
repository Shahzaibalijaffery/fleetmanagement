import { env } from '../../config/env';
import { areNotificationsEnabled } from '../../config/notifications';

import { logNotification } from './notification-reminders.logger';
import { notificationRemindersService } from './notification-reminders.service';

export function startNotificationScheduler() {
  if (!areNotificationsEnabled()) {
    return;
  }

  const intervalMinutes = env.NOTIFICATION_CHECK_INTERVAL_MINUTES;
  const intervalMs = intervalMinutes * 60 * 1000;

  logNotification(`Scheduler started — checking every ${intervalMinutes} minute(s)`);

  void notificationRemindersService
    .processReminders({ source: 'scheduler' })
    .catch((error) => {
      console.error('[notifications] Scheduler run failed:', error);
    });

  setInterval(() => {
    void notificationRemindersService
      .processReminders({ source: 'scheduler' })
      .catch((error) => {
        console.error('[notifications] Scheduler run failed:', error);
      });
  }, intervalMs);
}
