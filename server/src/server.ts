import 'dotenv/config';

import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { startNotificationSchedulers } from './features/notification-reminders/notification-reminders.scheduler';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`FleetLink API running on http://localhost:${env.PORT}/api/v1`);
    startNotificationSchedulers();
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
