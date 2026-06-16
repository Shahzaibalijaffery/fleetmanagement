import { apiClient } from '@/shared/api/client';

import type {
  DeviceTokenRecord,
  RegisterDeviceTokenRequest,
  RemoveDeviceTokenRequest,
} from '../types/push-notifications.types';

export const pushNotificationsService = {
  async registerDeviceToken(payload: RegisterDeviceTokenRequest): Promise<DeviceTokenRecord> {
    const { data } = await apiClient.post<{ data: DeviceTokenRecord }>(
      '/push-notifications/device-tokens',
      payload,
    );

    return data.data;
  },

  async removeDeviceToken(payload: RemoveDeviceTokenRequest): Promise<DeviceTokenRecord | null> {
    const { data } = await apiClient.delete<{ data: DeviceTokenRecord | null }>(
      '/push-notifications/device-tokens',
      { data: payload },
    );

    return data.data;
  },
};
