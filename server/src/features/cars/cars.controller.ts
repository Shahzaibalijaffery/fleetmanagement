import type { NextFunction, Request, Response } from 'express';

import { parsePagination } from '../../shared/types/pagination.types';

import { carsService } from './cars.service';
import type {
  CarStatus,
  CreateCarInput,
  UpdateCarInput,
  UpdatePersonalMaintenanceInput,
  UpdatePersonalOdometerInput,
} from './cars.types';

export const carsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const status = req.query.status as CarStatus | undefined;

      const result = await carsService.listCars(req.user!.id, { page, limit, status });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await carsService.getCar(req.user!.id, String(req.params.carId));
      res.json({ data: car });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await carsService.createCar(req.user!.id, req.body as CreateCarInput);
      res.status(201).json({ data: car });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await carsService.updateCar(
        req.user!.id,
        String(req.params.carId),
        req.body as UpdateCarInput,
      );
      res.json({ data: car });
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await carsService.deleteCar(req.user!.id, String(req.params.carId));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async updatePersonalMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await carsService.updatePersonalMaintenance(
        req.user!.id,
        String(req.params.carId),
        req.body as UpdatePersonalMaintenanceInput,
      );
      res.json({ data: car });
    } catch (error) {
      next(error);
    }
  },

  async updatePersonalOdometer(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await carsService.updatePersonalOdometer(
        req.user!.id,
        String(req.params.carId),
        req.body as UpdatePersonalOdometerInput,
      );
      res.json({ data: car });
    } catch (error) {
      next(error);
    }
  },

  async completePersonalMaintenanceItem(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await carsService.completePersonalMaintenanceItem(
        req.user!.id,
        String(req.params.carId),
        String(req.params.itemId),
        req.body.personalCurrentOdometerKm as number | undefined,
      );
      res.json({ data: car });
    } catch (error) {
      next(error);
    }
  },
};
