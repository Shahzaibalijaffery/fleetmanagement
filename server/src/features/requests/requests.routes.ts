import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';

import { requestsController } from './requests.controller';
import {
  createRequestSchema,
  getRequestSchema,
  listRequestsSchema,
  requestActionSchema,
} from './requests.validation';

const router = Router();

router.use(authenticate);

router.get('/', validate(listRequestsSchema), requestsController.list);
router.get('/:requestId', validate(getRequestSchema), requestsController.get);

router.post(
  '/',
  authorize('driver'),
  validate(createRequestSchema),
  requestsController.create,
);

router.post(
  '/:requestId/accept',
  authorize('owner'),
  validate(requestActionSchema),
  requestsController.accept,
);

router.post(
  '/:requestId/reject',
  authorize('owner'),
  validate(requestActionSchema),
  requestsController.reject,
);

export { router as requestsRoutes };
