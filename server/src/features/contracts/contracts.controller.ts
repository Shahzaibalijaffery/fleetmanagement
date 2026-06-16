import type { NextFunction, Request, Response } from 'express';

import { parsePagination } from '../../shared/types/pagination.types';
import type { UserRole } from '../auth/auth.types';

import { contractsService } from './contracts.service';
import type { ContractStatus, CreateContractInput, UpdateContractInput } from './contracts.types';

export const contractsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await contractsService.createContract(
        req.user!.id,
        req.body as CreateContractInput,
      );
      res.status(201).json({ data: contract });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const status = req.query.status as ContractStatus | undefined;
      const role = req.user!.role as UserRole;

      const result = await contractsService.listContracts(req.user!.id, role, {
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
      const contract = await contractsService.getContract(
        req.user!.id,
        req.user!.role as UserRole,
        String(req.params.contractId),
      );
      res.json({ data: contract });
    } catch (error) {
      next(error);
    }
  },

  async getByAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await contractsService.getContractByAssignment(
        req.user!.id,
        req.user!.role as UserRole,
        String(req.params.assignmentId),
      );
      res.json({ data: contract });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await contractsService.updateContract(
        req.user!.id,
        String(req.params.contractId),
        req.body as UpdateContractInput,
      );
      res.json({ data: contract });
    } catch (error) {
      next(error);
    }
  },

  async updateOdometer(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await contractsService.updateOdometer(
        req.user!.id,
        req.user!.role as UserRole,
        String(req.params.contractId),
        req.body,
      );
      res.json({ data: contract });
    } catch (error) {
      next(error);
    }
  },

  async completeMaintenanceItem(req: Request, res: Response, next: NextFunction) {
    try {
      const contract = await contractsService.completeMaintenanceItem(
        req.user!.id,
        req.user!.role as UserRole,
        String(req.params.contractId),
        String(req.params.itemId),
        req.body?.cost,
        req.body?.currentOdometerKm,
      );
      res.json({ data: contract });
    } catch (error) {
      next(error);
    }
  },
};
