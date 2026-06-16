import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import type {
  PushNavigationIntent,
  PushNotificationData,
  PushNotificationType,
  RemotePushNotification,
} from '../types/push-notifications.types';
import { PUSH_NOTIFICATION_TYPES } from '../types/push-notifications.types';

function isPushNotificationType(value: string): value is PushNotificationType {
  return PUSH_NOTIFICATION_TYPES.includes(value as PushNotificationType);
}

function normalizeData(data: FirebaseMessagingTypes.RemoteMessage['data']): PushNotificationData {
  if (!data) {
    return {};
  }

  return Object.entries(data).reduce<PushNotificationData>((accumulator, [key, value]) => {
    if (typeof value === 'string') {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
}

export function parseRemotePushNotification(
  message: FirebaseMessagingTypes.RemoteMessage,
): RemotePushNotification {
  const data = normalizeData(message.data);

  return {
    title: message.notification?.title ?? data.title ?? 'FleetLink',
    body: message.notification?.body ?? data.body ?? '',
    data,
  };
}

export function parsePushNavigationIntent(
  notification: RemotePushNotification,
): PushNavigationIntent {
  const rawType = notification.data.type;

  if (!rawType || !isPushNotificationType(rawType)) {
    return {
      type: 'unknown',
      params: sanitizeParams(notification.data),
    };
  }

  return {
    type: rawType,
    params: sanitizeParams(notification.data),
  };
}

function sanitizeParams(data: PushNotificationData): Record<string, string> {
  return Object.entries(data).reduce<Record<string, string>>((accumulator, [key, value]) => {
    if (value != null && key !== 'type') {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
}
