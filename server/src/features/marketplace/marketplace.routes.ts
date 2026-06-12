import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';

import { marketplaceController } from './marketplace.controller';
import {
  listMarketplaceCarsSchema,
  listMarketplaceDriversSchema,
} from './marketplace.validation';

const router = Router();

router.use(authenticate);

router.get(
  '/cars',
  authorize('driver'),
  validate(listMarketplaceCarsSchema),
  marketplaceController.listCars,
);

router.get(
  '/drivers',
  authorize('owner'),
  validate(listMarketplaceDriversSchema),
  marketplaceController.listDrivers,
);

export { router as marketplaceRoutes };
