import { DeviceTokenModel } from '../../models/device-token.model';

import type { PushPlatform, RegisterDeviceTokenInput } from './push-notifications.types';

export const deviceTokenRepository = {
  async upsertForUser(userId: string, input: RegisterDeviceTokenInput) {
    return DeviceTokenModel.findOneAndUpdate(
      { token: input.token },
      {
        userId,
        token: input.token,
        platform: input.platform,
        deviceId: input.deviceId ?? null,
        lastUsedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
  },

  async deleteByToken(token: string) {
    return DeviceTokenModel.findOneAndDelete({ token }).lean();
  },

  async deleteByUserAndToken(userId: string, token: string) {
    return DeviceTokenModel.findOneAndDelete({ userId, token }).lean();
  },

  async findTokensByUserId(userId: string) {
    return DeviceTokenModel.find({ userId }).select('token platform').lean();
  },

  async deleteTokens(tokens: string[]) {
    if (tokens.length === 0) {
      return;
    }

    await DeviceTokenModel.deleteMany({ token: { $in: tokens } });
  },

  async touchToken(token: string, platform: PushPlatform) {
    return DeviceTokenModel.findOneAndUpdate(
      { token },
      { platform, lastUsedAt: new Date() },
      { new: true },
    ).lean();
  },
};
