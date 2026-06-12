import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';

import { contractsController } from './contracts.controller';
import {
  completeMaintenanceItemSchema,
  createContractSchema,
  getContractByAssignmentSchema,
  getContractSchema,
  listContractsSchema,
  updateContractOdometerSchema,
  updateContractSchema,
} from './contracts.validation';

const router = Router();

router.use(authenticate);

router.get(
  '/by-assignment/:assignmentId',
  validate(getContractByAssignmentSchema),
  contractsController.getByAssignment,
);

router.get('/', validate(listContractsSchema), contractsController.list);
router.get('/:contractId', validate(getContractSchema), contractsController.get);

router.post(
  '/',
  authorize('owner'),
  validate(createContractSchema),
  contractsController.create,
);

router.patch(
  '/:contractId',
  authorize('owner'),
  validate(updateContractSchema),
  contractsController.update,
);

router.patch(
  '/:contractId/odometer',
  validate(updateContractOdometerSchema),
  contractsController.updateOdometer,
);

router.post(
  '/:contractId/maintenance/:itemId/complete',
  validate(completeMaintenanceItemSchema),
  contractsController.completeMaintenanceItem,
);

export { router as contractsRoutes };
