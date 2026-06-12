import type { NextFunction, Request, Response } from 'express';

import { parsePagination } from '../../shared/types/pagination.types';

import { carExpensesService } from './car-expenses.service';
import type {
  AddCarExpenseItemInput,
  CreateCarExpenseLogInput,
  UpdateCarExpenseItemInput,
  UpdateCarExpenseLogInput,
} from './car-expenses.types';

export const carExpensesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await carExpensesService.listExpenses(req.user!.id, String(req.params.carId), {
        page,
        limit,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await carExpensesService.createExpense(
        req.user!.id,
        String(req.params.carId),
        req.body as CreateCarExpenseLogInput,
      );
      res.status(201).json({ data: log });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await carExpensesService.updateExpense(
        req.user!.id,
        String(req.params.carId),
        String(req.params.logId),
        req.body as UpdateCarExpenseLogInput,
      );
      res.json({ data: log });
    } catch (error) {
      next(error);
    }
  },

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await carExpensesService.addExpenseItem(
        req.user!.id,
        String(req.params.carId),
        String(req.params.logId),
        req.body as AddCarExpenseItemInput,
      );
      res.status(201).json({ data: log });
    } catch (error) {
      next(error);
    }
  },

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await carExpensesService.updateExpenseItem(
        req.user!.id,
        String(req.params.carId),
        String(req.params.logId),
        String(req.params.itemId),
        req.body as UpdateCarExpenseItemInput,
      );
      res.json({ data: log });
    } catch (error) {
      next(error);
    }
  },

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await carExpensesService.removeExpenseItem(
        req.user!.id,
        String(req.params.carId),
        String(req.params.logId),
        String(req.params.itemId),
      );

      if (!log) {
        res.status(204).send();
        return;
      }

      res.json({ data: log });
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await carExpensesService.deleteExpense(
        req.user!.id,
        String(req.params.carId),
        String(req.params.logId),
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
