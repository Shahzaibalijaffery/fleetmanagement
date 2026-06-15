import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';

import { expensesController } from './expenses.controller';
import {
  createExpenseSchema,
  deleteExpenseSchema,
  getExpenseSchema,
  listExpensesSchema,
  setMonthlySalarySchema,
  updateExpenseSchema,
} from './expenses.validation';

const router = Router();

router.use(authenticate, authorize('owner'));

router.get('/', validate(listExpensesSchema), expensesController.list);
router.post('/', validate(createExpenseSchema), expensesController.create);
router.put('/salary', validate(setMonthlySalarySchema), expensesController.setSalary);
router.get('/:expenseId', validate(getExpenseSchema), expensesController.get);
router.patch('/:expenseId', validate(updateExpenseSchema), expensesController.update);
router.delete('/:expenseId', validate(deleteExpenseSchema), expensesController.remove);

export { router as expensesRoutes };
