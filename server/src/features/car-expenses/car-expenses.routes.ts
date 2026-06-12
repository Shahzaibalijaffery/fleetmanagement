import { Router } from 'express';

import { validate } from '../../middleware/validate';

import { carExpensesController } from './car-expenses.controller';
import {
  addCarExpenseItemSchema,
  createCarExpenseSchema,
  deleteCarExpenseSchema,
  listCarExpensesSchema,
  removeCarExpenseItemSchema,
  updateCarExpenseItemSchema,
  updateCarExpenseSchema,
} from './car-expenses.validation';

const router = Router({ mergeParams: true });

router.get('/', validate(listCarExpensesSchema), carExpensesController.list);
router.post('/', validate(createCarExpenseSchema), carExpensesController.create);
router.patch('/:logId', validate(updateCarExpenseSchema), carExpensesController.update);
router.post('/:logId/items', validate(addCarExpenseItemSchema), carExpensesController.addItem);
router.patch(
  '/:logId/items/:itemId',
  validate(updateCarExpenseItemSchema),
  carExpensesController.updateItem,
);
router.delete(
  '/:logId/items/:itemId',
  validate(removeCarExpenseItemSchema),
  carExpensesController.removeItem,
);
router.delete('/:logId', validate(deleteCarExpenseSchema), carExpensesController.remove);

export { router as carExpensesRoutes };
