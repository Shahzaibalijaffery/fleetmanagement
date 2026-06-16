import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationRemindersService } from '../services/notification-reminders.service';
import type { UpdateNotificationPreferencesRequest } from '../types/notification-reminders.types';
import { notificationRemindersKeys } from './notification-reminders.keys';

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNotificationPreferencesRequest) =>
      notificationRemindersService.updatePreferences(payload),
    onSuccess: (preferences) => {
      queryClient.setQueryData(notificationRemindersKeys.preferences(), preferences);
    },
  });
}
