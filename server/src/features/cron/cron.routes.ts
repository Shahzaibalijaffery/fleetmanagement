import { Router } from 'express';

import { verifyCronSecret } from '../../middleware/verifyCronSecret';
import { validate } from '../../middleware/validate';

import { cronController } from './cron.controller';
import { expenseReminderCronSchema } from './cron.validation';

const router = Router();

router.use(verifyCronSecret);

router.post('/wake', cronController.wake);
router.post(
  '/expense-reminders',
  validate(expenseReminderCronSchema),
  cronController.expenseReminders,
);
router.post('/maintenance-reminders', cronController.maintenanceReminders);

export { router as cronRoutes };
