import 'dotenv/config';

import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { isFirebaseConfigured } from './config/firebase';
import { getExpenseReminderTimesSummary } from './features/notification-reminders/expense-reminder-times.config';
import { startNotificationScheduler } from './features/notification-reminders/notification-scheduler';
import { isEmailConfigured } from './shared/services/email.service';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`FleetLink API running on http://localhost:${env.PORT}/api/v1`);
    console.log(
      isEmailConfigured()
        ? '[email] Nodemailer SMTP configured — OTP emails will be sent'
        : '[email] SMTP not configured — OTP codes log to console only',
    );
    console.log(
      isFirebaseConfigured()
        ? '[notifications] Firebase configured — push notifications enabled'
        : '[notifications] Firebase not configured — push notifications will be skipped',
    );
    console.log(`[notifications] Expense reminder times (${env.NOTIFICATION_TIMEZONE}): ${getExpenseReminderTimesSummary()}`);
    console.log(
      `[notifications] Scheduler checks every ${env.NOTIFICATION_CHECK_INTERVAL_MINUTES} min — slot grace ${env.NOTIFICATION_SLOT_GRACE_MINUTES} min`,
    );

    startNotificationScheduler();
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
