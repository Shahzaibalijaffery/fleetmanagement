import type { NextFunction, Request, Response } from 'express';

import { ForbiddenError } from '../../shared/errors/AppError';
import type { UserRole } from '../auth/auth.types';

import { dashboardService } from './dashboard.service';

export const dashboardController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const role = req.user!.role as UserRole;
      const userId = req.user!.id;

      if (role === 'owner') {
        const data = await dashboardService.getOwnerDashboard(userId);
        res.json({ data });
        return;
      }

      if (role === 'driver') {
        const data = await dashboardService.getDriverDashboard(userId);
        res.json({ data });
        return;
      }

      next(new ForbiddenError('Access denied'));
    } catch (error) {
      next(error);
    }
  },
};
