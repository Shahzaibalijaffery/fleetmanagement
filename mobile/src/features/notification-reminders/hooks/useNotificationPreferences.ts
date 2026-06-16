import { useQuery } from '@tanstack/react-query';

import { env } from '@/shared/config/env';

import { notificationRemindersService } from '../services/notification-reminders.service';
import { notificationRemindersKeys } from './notification-reminders.keys';

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationRemindersKeys.preferences(),
    queryFn: () => notificationRemindersService.getPreferences(),
    enabled: env.PUSH_NOTIFICATIONS_ENABLED,
  });
}
