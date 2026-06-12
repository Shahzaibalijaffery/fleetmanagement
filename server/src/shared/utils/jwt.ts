import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env';
import type { UserRole } from '../../features/auth/auth.types';

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

  if (typeof decoded !== 'object' || decoded === null) {
    throw new Error('Invalid token payload');
  }

  const { userId, role } = decoded as AccessTokenPayload;

  if (!userId || !role) {
    throw new Error('Invalid token payload');
  }

  return { userId, role };
}
