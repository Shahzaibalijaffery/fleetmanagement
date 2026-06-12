import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';

import { carExpensesRoutes } from '../car-expenses/car-expenses.routes';

import { carsController } from './cars.controller';
import {
  completePersonalMaintenanceItemSchema,
  updatePersonalMaintenanceSchema,
  updatePersonalOdometerSchema,
} from './personal-maintenance.validation';
import {
  createCarSchema,
  deleteCarSchema,
  getCarSchema,
  listCarsSchema,
  updateCarSchema,
} from './cars.validation';

const router = Router();

router.use(authenticate, authorize('owner'));

router.get('/', validate(listCarsSchema), carsController.list);
router.post('/', validate(createCarSchema), carsController.create);
router.patch(
  '/:carId/personal-maintenance',
  validate(updatePersonalMaintenanceSchema),
  carsController.updatePersonalMaintenance,
);
router.patch(
  '/:carId/personal-maintenance/odometer',
  validate(updatePersonalOdometerSchema),
  carsController.updatePersonalOdometer,
);
router.post(
  '/:carId/personal-maintenance/:itemId/complete',
  validate(completePersonalMaintenanceItemSchema),
  carsController.completePersonalMaintenanceItem,
);
router.get('/:carId', validate(getCarSchema), carsController.get);
router.patch('/:carId', validate(updateCarSchema), carsController.update);
router.delete('/:carId', validate(deleteCarSchema), carsController.remove);
router.use('/:carId/expenses', carExpensesRoutes);

export { router as carsRoutes };
