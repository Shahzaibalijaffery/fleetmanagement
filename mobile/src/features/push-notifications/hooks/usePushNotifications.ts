import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/stores/auth.store';

import {
  deleteFcmToken,
  getFcmToken,
  getInitialNotification,
  getPushPlatform,
  isPushNotificationsAvailable,
  onFcmTokenRefresh,
  onForegroundMessage,
  onNotificationOpenedApp,
  requestPushPermission,
} from '../services/fcm.service';
import { useRegisterDeviceToken } from './useRegisterDeviceToken';
import { useRemoveDeviceToken } from './useRemoveDeviceToken';
import { usePushNotificationHandler } from './usePushNotificationHandler';
import {
  parsePushNavigationIntent,
  parseRemotePushNotification,
} from '../utils/parsePushNotification';

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const registerDeviceToken = useRegisterDeviceToken();
  const removeDeviceToken = useRemoveDeviceToken();
  const { handleNotificationOpen } = usePushNotificationHandler();
  const activeTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isPushNotificationsAvailable() || !isBootstrapped) {
      return;
    }

    void requestPushPermission();
  }, [isBootstrapped]);

  const syncDeviceToken = async (token: string) => {
    activeTokenRef.current = token;
    await registerDeviceToken.mutateAsync({
      token,
      platform: getPushPlatform(),
    });
  };

  const clearDeviceToken = async () => {
    const token = activeTokenRef.current;

    if (token) {
      await removeDeviceToken.mutateAsync({ token });
    }

    await deleteFcmToken();
    activeTokenRef.current = null;
  };

  useEffect(() => {
    if (!isPushNotificationsAvailable() || !isBootstrapped) {
      return;
    }

    if (!isAuthenticated) {
      if (activeTokenRef.current) {
        void clearDeviceToken();
      }
      return;
    }

    let isMounted = true;

    const registerCurrentToken = async () => {
      const token = await getFcmToken();

      if (!isMounted || !token) {
        return;
      }

      await syncDeviceToken(token);
    };

    void registerCurrentToken();

    const unsubscribeTokenRefresh = onFcmTokenRefresh((token) => {
      void syncDeviceToken(token);
    });

    const unsubscribeForeground = onForegroundMessage((message) => {
      const remoteNotification = parseRemotePushNotification(message);

      if (__DEV__) {
        console.log('[push] Foreground notification:', remoteNotification);
      }
    });

    const unsubscribeOpened = onNotificationOpenedApp((message) => {
      const remoteNotification = parseRemotePushNotification(message);
      handleNotificationOpen(parsePushNavigationIntent(remoteNotification));
    });

    void getInitialNotification().then((message) => {
      if (!message) {
        return;
      }

      const remoteNotification = parseRemotePushNotification(message);
      handleNotificationOpen(parsePushNavigationIntent(remoteNotification));
    });

    return () => {
      isMounted = false;
      unsubscribeTokenRefresh();
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [handleNotificationOpen, isAuthenticated, isBootstrapped]);
}
