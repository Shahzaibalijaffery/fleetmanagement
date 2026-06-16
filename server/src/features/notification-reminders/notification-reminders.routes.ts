import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';

import { notificationRemindersController } from './notification-reminders.controller';
import { updateNotificationPreferencesSchema } from './notification-reminders.validation';

const router = Router();

router.get(
  '/preferences',
  authenticate,
  authorize('owner', 'driver'),
  notificationRemindersController.getPreferences,
);

router.patch(
  '/preferences',
  authenticate,
  authorize('owner', 'driver'),
  validate(updateNotificationPreferencesSchema),
  notificationRemindersController.updatePreferences,
);

export { router as notificationRemindersRoutes };
