import { RefreshTokenModel } from '../../models/refresh-token.model';

import type { RefreshTokenDocument } from './auth.types';

export interface CreateRefreshTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export const refreshTokenRepository = {
  create(data: CreateRefreshTokenData) {
    return RefreshTokenModel.create(data);
  },

  findById(id: string) {
    return RefreshTokenModel.findById(id).lean<RefreshTokenDocument>();
  },

  revokeById(id: string) {
    return RefreshTokenModel.findByIdAndUpdate(
      id,
      { revokedAt: new Date() },
      { new: true },
    ).lean<RefreshTokenDocument>();
  },

  revokeAllByUserId(userId: string) {
    return RefreshTokenModel.updateMany(
      { userId, revokedAt: null },
      { revokedAt: new Date() },
    );
  },
};
