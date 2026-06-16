import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';

import { pushNotificationsController } from './push-notifications.controller';
import {
  registerDeviceTokenSchema,
  removeDeviceTokenSchema,
} from './push-notifications.validation';

const router = Router();

router.post(
  '/device-tokens',
  authenticate,
  validate(registerDeviceTokenSchema),
  pushNotificationsController.registerDeviceToken,
);

router.delete(
  '/device-tokens',
  authenticate,
  validate(removeDeviceTokenSchema),
  pushNotificationsController.removeDeviceToken,
);

export { router as pushNotificationsRoutes };
