import { areNotificationsEnabled } from '../../config/notifications';

import { pushNotificationsService } from './push-notifications.service';
import type { PushNotificationPayload } from './push-notifications.types';

const disabledPushResult = { successCount: 0, failureCount: 0, skipped: true };

export async function sendPushToUser(userId: string, payload: PushNotificationPayload) {
  if (!areNotificationsEnabled()) {
    return disabledPushResult;
  }

  return pushNotificationsService.sendToUser(userId, payload);
}

export async function sendPushToUsers(userIds: string[], payload: PushNotificationPayload) {
  if (!areNotificationsEnabled()) {
    return disabledPushResult;
  }

  return pushNotificationsService.sendToUsers(userIds, payload);
}
