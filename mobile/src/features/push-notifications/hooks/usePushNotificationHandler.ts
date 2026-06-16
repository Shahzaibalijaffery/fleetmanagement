import { useCallback, useRef } from 'react';

import type { PushNavigationIntent } from '../types/push-notifications.types';

export function usePushNotificationHandler() {
  const pendingIntentRef = useRef<PushNavigationIntent | null>(null);

  const handleNotificationOpen = useCallback((intent: PushNavigationIntent) => {
    pendingIntentRef.current = intent;

    if (__DEV__) {
      console.log('[push] Notification opened:', intent);
    }

    // Navigation targets will be wired when notification events are implemented.
  }, []);

  const consumePendingIntent = useCallback(() => {
    const intent = pendingIntentRef.current;
    pendingIntentRef.current = null;
    return intent;
  }, []);

  return {
    handleNotificationOpen,
    consumePendingIntent,
  };
}
