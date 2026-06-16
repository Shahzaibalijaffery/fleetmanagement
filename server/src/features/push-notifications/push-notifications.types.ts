export const PUSH_PLATFORMS = ['ios', 'android'] as const;

export type PushPlatform = (typeof PUSH_PLATFORMS)[number];

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

export interface PushNotificationPayload {
  type: PushNotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface RegisterDeviceTokenInput {
  token: string;
  platform: PushPlatform;
  deviceId?: string;
}

export interface RemoveDeviceTokenInput {
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

export interface SendPushResult {
  successCount: number;
  failureCount: number;
  skipped: boolean;
}
