import type { NextFunction, Request, Response } from 'express';

import { userRepository } from '../features/auth/user.repository';
import { UnauthorizedError } from '../shared/errors/AppError';
import { verifyAccessToken } from '../shared/utils/jwt';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      next(new UnauthorizedError('No token provided'));
      return;
    }

    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      next(new UnauthorizedError('User not found'));
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
