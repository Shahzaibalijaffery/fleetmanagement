export const PUSH_NOTIFICATION_TYPES = [
  'assignment_created',
  'assignment_accepted',
  'contract_updated',
  'maintenance_due',
  'request_received',
  'expense_reminder',
  'general',
] as const;

export type PushNotificationType = (typeof PUSH_NOTIFICATION_TYPES)[number];

export type PushPlatform = 'ios' | 'android';

export interface PushNotificationData {
  type?: PushNotificationType;
  [key: string]: string | undefined;
}

export interface RemotePushNotification {
  title: string;
  body: string;
  data: PushNotificationData;
}

export interface PushNavigationIntent {
  type: PushNotificationType | 'unknown';
  params: Record<string, string>;
}

export interface RegisterDeviceTokenRequest {
  token: string;
  platform: PushPlatform;
  deviceId?: string;
}

export interface RemoveDeviceTokenRequest {
  token: string;
}

export interface DeviceTokenRecord {
  id: string;
  userId: string;
  token: string;
  platform: PushPlatform;
  deviceId: string | null;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
}
