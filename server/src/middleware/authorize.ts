import type { NextFunction, Request, Response } from 'express';

import type { UserRole } from '../features/auth/auth.types';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/AppError';

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError('Access denied'));
      return;
    }

    next();
  };
}
