import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';

import { profileController } from './profile.controller';
import { updateProfileSchema } from './profile.validation';

const router = Router();

router.get('/', authenticate, profileController.get);
router.patch('/', authenticate, validate(updateProfileSchema), profileController.update);

export { router as profileRoutes };
