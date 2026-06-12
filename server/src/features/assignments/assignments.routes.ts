import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';

import { assignmentsController } from './assignments.controller';
import {
  getActiveForCarSchema,
  getAssignmentSchema,
  listAssignmentsSchema,
} from './assignments.validation';

const router = Router();

router.use(authenticate);

router.get('/active/me', authorize('driver'), assignmentsController.getMyActive);
router.get(
  '/active/car/:carId',
  authorize('owner'),
  validate(getActiveForCarSchema),
  assignmentsController.getActiveForCar,
);

router.get('/', validate(listAssignmentsSchema), assignmentsController.list);
router.get('/:assignmentId', validate(getAssignmentSchema), assignmentsController.get);

export { router as assignmentsRoutes };
