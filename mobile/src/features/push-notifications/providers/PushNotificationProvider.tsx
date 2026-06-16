import type { ReactNode } from 'react';

import { usePushNotifications } from '../hooks/usePushNotifications';

interface PushNotificationProviderProps {
  children: ReactNode;
}

export function PushNotificationProvider({ children }: PushNotificationProviderProps) {
  usePushNotifications();
  return children;
}
