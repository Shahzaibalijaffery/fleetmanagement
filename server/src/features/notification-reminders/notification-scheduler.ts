import { env } from '../../config/env';

import { logNotification } from './notification-reminders.logger';
import { notificationRemindersService } from './notification-reminders.service';

export function startNotificationScheduler() {
  const intervalMinutes = env.NOTIFICATION_POLL_INTERVAL_MINUTES;

  if (intervalMinutes <= 0) {
    logNotification('Scheduler disabled — set NOTIFICATION_POLL_INTERVAL_MINUTES to enable');
    return;
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  logNotification(`Scheduler started — processing every ${intervalMinutes} minute(s)`);

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
