import 'dotenv/config';

import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
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
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
