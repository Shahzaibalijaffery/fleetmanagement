import { apiClient } from '@/shared/api/client';

import type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from '../types/notification-reminders.types';

export const notificationRemindersService = {
  async getPreferences(): Promise<NotificationPreferences> {
    const { data } = await apiClient.get<{ data: NotificationPreferences }>(
      '/notification-reminders/preferences',
    );

    return data.data;
  },

  async updatePreferences(
    payload: UpdateNotificationPreferencesRequest,
  ): Promise<NotificationPreferences> {
    const { data } = await apiClient.patch<{ data: NotificationPreferences }>(
      '/notification-reminders/preferences',
      payload,
    );

    return data.data;
  },
};
