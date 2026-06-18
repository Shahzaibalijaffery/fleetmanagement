import { timingSafeEqual } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/AppError';

function readCronSecret(req: Request): string | undefined {
  const headerSecret = req.headers['x-cron-secret'];

  if (typeof headerSecret === 'string' && headerSecret.length > 0) {
    return headerSecret;
  }

  const authorization = req.headers.authorization;

  if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length);
  }

  return undefined;
}

function secretsMatch(expected: string, provided: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export function verifyCronSecret(req: Request, _res: Response, next: NextFunction): void {
  if (!env.CRON_SECRET) {
    next(new ForbiddenError('Cron endpoints are not configured'));
    return;
  }

  const providedSecret = readCronSecret(req);

  if (!providedSecret) {
    next(new UnauthorizedError('Cron secret is required'));
    return;
  }

  if (!secretsMatch(env.CRON_SECRET, providedSecret)) {
    next(new ForbiddenError('Invalid cron secret'));
    return;
  }

  next();
}
