import type { NextFunction, Request, Response } from 'express';

import { parsePagination } from '../../shared/types/pagination.types';
import type { UserRole } from '../auth/auth.types';

import { requestsService } from './requests.service';
import type { CreateRequestInput, RequestStatus } from './requests.types';

export const requestsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await requestsService.createRequest(
        req.user!.id,
        req.body as CreateRequestInput,
      );
      res.status(201).json({ data: request });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const status = req.query.status as RequestStatus | undefined;
      const role = req.user!.role as UserRole;

      const result = await requestsService.listRequests(req.user!.id, role, {
        page,
        limit,
        status,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await requestsService.getRequest(
        req.user!.id,
        req.user!.role as UserRole,
        String(req.params.requestId),
      );
      res.json({ data: request });
    } catch (error) {
      next(error);
    }
  },

  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await requestsService.acceptRequest(
        req.user!.id,
        String(req.params.requestId),
      );
      res.json({ data: request });
    } catch (error) {
      next(error);
    }
  },

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await requestsService.rejectRequest(
        req.user!.id,
        String(req.params.requestId),
      );
      res.json({ data: request });
    } catch (error) {
      next(error);
    }
  },
};
