import { getFirebaseMessaging, isFirebaseConfigured } from '../../config/firebase';
import { NotFoundError } from '../../shared/errors/AppError';

import { deviceTokenRepository } from './device-token.repository';
import type {
  DeviceTokenRecord,
  PushNotificationPayload,
  RegisterDeviceTokenInput,
  RemoveDeviceTokenInput,
  SendPushResult,
} from './push-notifications.types';

function toDeviceTokenRecord(doc: {
  _id: { toString(): string };
  userId: { toString(): string };
  token: string;
  platform: DeviceTokenRecord['platform'];
  deviceId?: string | null;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}): DeviceTokenRecord {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    token: doc.token,
    platform: doc.platform,
    deviceId: doc.deviceId ?? null,
    lastUsedAt: doc.lastUsedAt.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function buildSkippedResult(): SendPushResult {
  return { successCount: 0, failureCount: 0, skipped: true };
}

export const pushNotificationsService = {
  async registerDeviceToken(userId: string, input: RegisterDeviceTokenInput) {
    const doc = await deviceTokenRepository.upsertForUser(userId, input);

    if (!doc) {
      throw new NotFoundError('Device token not found');
    }

    return toDeviceTokenRecord(doc as Parameters<typeof toDeviceTokenRecord>[0]);
  },

  async removeDeviceToken(userId: string, input: RemoveDeviceTokenInput) {
    const doc = await deviceTokenRepository.deleteByUserAndToken(userId, input.token);

    if (!doc) {
      return null;
    }

    return toDeviceTokenRecord(doc as Parameters<typeof toDeviceTokenRecord>[0]);
  },

  async sendToUser(userId: string, payload: PushNotificationPayload): Promise<SendPushResult> {
    const tokens = await deviceTokenRepository.findTokensByUserId(userId);
    const tokenValues = tokens.map((entry) => entry.token);

    console.log('[notifications] push attempt', {
      userId,
      type: payload.type,
      title: payload.title,
      tokenCount: tokenValues.length,
      firebaseConfigured: isFirebaseConfigured(),
    });

    return this.sendToTokens(tokenValues, payload, userId);
  },

  async sendToUsers(userIds: string[], payload: PushNotificationPayload): Promise<SendPushResult> {
    const tokenSets = await Promise.all(
      userIds.map((userId) => deviceTokenRepository.findTokensByUserId(userId)),
    );
    const tokenValues = tokenSets.flat().map((entry) => entry.token);

    return this.sendToTokens(tokenValues, payload);
  },

  async sendToTokens(
    tokens: string[],
    payload: PushNotificationPayload,
    userId?: string,
  ): Promise<SendPushResult> {
    if (tokens.length === 0) {
      console.warn('[notifications] push skipped — no device tokens', {
        userId: userId ?? null,
        type: payload.type,
      });
      return buildSkippedResult();
    }

    const messaging = getFirebaseMessaging();

    if (!messaging || !isFirebaseConfigured()) {
      console.warn('[notifications] push skipped — Firebase not configured', {
        userId: userId ?? null,
        type: payload.type,
        tokenCount: tokens.length,
      });
      return buildSkippedResult();
    }

    const uniqueTokens = [...new Set(tokens)];
    const data = {
      type: payload.type,
      ...(payload.data ?? {}),
    };

    const response = await messaging.sendEachForMulticast({
      tokens: uniqueTokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data,
    });

    const invalidTokens = response.responses
      .map((entry: { success: boolean }, index: number) =>
        entry.success ? null : uniqueTokens[index],
      )
      .filter((token: string | null): token is string => Boolean(token));

    await deviceTokenRepository.deleteTokens(invalidTokens);

    console.log('[notifications] push result', {
      userId: userId ?? null,
      type: payload.type,
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokenCount: invalidTokens.length,
    });

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      skipped: false,
    };
  },
};
