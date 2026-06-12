import type { NextFunction, Request, Response } from 'express';

import { parsePagination } from '../../shared/types/pagination.types';
import type { CarType } from '../cars/cars.types';

import { marketplaceService } from './marketplace.service';

export const marketplaceController = {
  async listCars(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const radiusKm = req.query.radiusKm != null ? Number(req.query.radiusKm) : 0;
      const latitude =
        req.query.latitude != null ? Number(req.query.latitude) : undefined;
      const longitude =
        req.query.longitude != null ? Number(req.query.longitude) : undefined;
      const referenceCity = req.query.referenceCity as string | undefined;
      const carType = req.query.carType as CarType | undefined;

      const result = await marketplaceService.listAvailableCars({
        page,
        limit,
        radiusKm,
        latitude,
        longitude,
        referenceCity,
        carType,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async listDrivers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const radiusKm = req.query.radiusKm != null ? Number(req.query.radiusKm) : 0;
      const latitude =
        req.query.latitude != null ? Number(req.query.latitude) : undefined;
      const longitude =
        req.query.longitude != null ? Number(req.query.longitude) : undefined;
      const referenceCity = req.query.referenceCity as string | undefined;
      const carType = req.query.carType as CarType | undefined;

      const result = await marketplaceService.listAvailableDrivers({
        page,
        limit,
        radiusKm,
        latitude,
        longitude,
        referenceCity,
        carType,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
