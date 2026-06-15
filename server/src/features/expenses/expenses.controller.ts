import type { NextFunction, Request, Response } from 'express';

import { ValidationError } from '../../shared/errors/AppError';
import { parsePagination } from '../../shared/types/pagination.types';

import { expensesService } from './expenses.service';
import type { CreateExpenseInput, SetMonthlySalaryInput, UpdateExpenseInput } from './expenses.types';
import { parseExpenseMonth } from './expenses.utils';

function parseIncludeCarExpenses(value: unknown): boolean {
  if (value === 'false') {
    return false;
  }

  return true;
}

export const expensesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const includeCarExpenses = parseIncludeCarExpenses(req.query.includeCarExpenses);

      let monthYear;
      try {
        monthYear = parseExpenseMonth({
          year: req.query.year as string | undefined,
          month: req.query.month as string | undefined,
        });
      } catch {
        throw new ValidationError('Invalid month or year');
      }

      const result = await expensesService.listExpenses(req.user!.id, {
        page,
        limit,
        includeCarExpenses,
        year: monthYear.year,
        month: monthYear.month,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await expensesService.getExpense(
        req.user!.id,
        String(req.params.expenseId),
      );
      res.json({ data: expense });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await expensesService.createExpense(
        req.user!.id,
        req.body as CreateExpenseInput,
      );
      res.status(201).json({ data: expense });
    } catch (error) {
      next(error);
    }
  },

  async setSalary(req: Request, res: Response, next: NextFunction) {
    try {
      const salary = await expensesService.setMonthlySalary(
        req.user!.id,
        req.body as SetMonthlySalaryInput,
      );
      res.json({ data: salary });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await expensesService.updateExpense(
        req.user!.id,
        String(req.params.expenseId),
        req.body as UpdateExpenseInput,
      );
      res.json({ data: expense });
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await expensesService.deleteExpense(req.user!.id, String(req.params.expenseId));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
