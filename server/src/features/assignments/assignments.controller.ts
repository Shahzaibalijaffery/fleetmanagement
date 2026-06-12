import type { NextFunction, Request, Response } from 'express';

import { parsePagination } from '../../shared/types/pagination.types';
import type { UserRole } from '../auth/auth.types';

import { assignmentsService } from './assignments.service';
import type { AssignmentStatus } from './assignments.types';

export const assignmentsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const status = req.query.status as AssignmentStatus | undefined;
      const carId = req.query.carId as string | undefined;
      const role = req.user!.role as UserRole;

      const result = await assignmentsService.listAssignments(req.user!.id, role, {
        page,
        limit,
        status,
        carId,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await assignmentsService.getAssignment(
        req.user!.id,
        req.user!.role as UserRole,
        String(req.params.assignmentId),
      );
      res.json({ data: assignment });
    } catch (error) {
      next(error);
    }
  },

  async getMyActive(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await assignmentsService.getActiveAssignmentForDriver(req.user!.id);
      res.json({ data: assignment });
    } catch (error) {
      next(error);
    }
  },

  async getActiveForCar(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await assignmentsService.getActiveAssignmentForCar(
        req.user!.id,
        String(req.params.carId),
      );
      res.json({ data: assignment });
    } catch (error) {
      next(error);
    }
  },
};
