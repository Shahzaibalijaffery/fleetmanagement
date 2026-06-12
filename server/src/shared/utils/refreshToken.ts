import { randomBytes } from 'crypto';

import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;

export async function generateRefreshTokenSecret(): Promise<string> {
  return randomBytes(40).toString('hex');
}

export async function hashRefreshTokenSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, BCRYPT_ROUNDS);
}

export async function compareRefreshTokenSecret(
  secret: string,
  tokenHash: string,
): Promise<boolean> {
  return bcrypt.compare(secret, tokenHash);
}

export function buildRefreshToken(tokenId: string, secret: string): string {
  return `${tokenId}.${secret}`;
}

export function parseRefreshToken(token: string): { tokenId: string; secret: string } {
  const separatorIndex = token.indexOf('.');

  if (separatorIndex === -1) {
    throw new Error('Invalid refresh token format');
  }

  const tokenId = token.slice(0, separatorIndex);
  const secret = token.slice(separatorIndex + 1);

  if (!tokenId || !secret) {
    throw new Error('Invalid refresh token format');
  }

  return { tokenId, secret };
}
