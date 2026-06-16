import { pushNotificationsService } from './push-notifications.service';
import type { PushNotificationPayload } from './push-notifications.types';

export async function sendPushToUser(userId: string, payload: PushNotificationPayload) {
  return pushNotificationsService.sendToUser(userId, payload);
}

export async function sendPushToUsers(userIds: string[], payload: PushNotificationPayload) {
  return pushNotificationsService.sendToUsers(userIds, payload);
}
