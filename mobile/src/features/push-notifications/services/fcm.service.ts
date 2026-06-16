import { PermissionsAndroid, Platform } from 'react-native';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { env } from '@/shared/config/env';

import type { PushPlatform } from '../types/push-notifications.types';

type MessagingModule = typeof import('@react-native-firebase/messaging').default;

const ANDROID_POST_NOTIFICATIONS_MIN_SDK = 33;

function getMessaging(): MessagingModule | null {
  if (!env.PUSH_NOTIFICATIONS_ENABLED) {
    return null;
  }

  // Lazy load so the app still runs when Firebase native config is not set up yet.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@react-native-firebase/messaging').default;
}

export function getPushPlatform(): PushPlatform {
  return Platform.OS === 'ios' ? 'ios' : 'android';
}

export function isPushNotificationsAvailable(): boolean {
  return env.PUSH_NOTIFICATIONS_ENABLED;
}

async function requestAndroidNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (typeof Platform.Version === 'number' && Platform.Version < ANDROID_POST_NOTIFICATIONS_MIN_SDK) {
    return true;
  }

  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  const isGranted = await PermissionsAndroid.check(permission);

  if (isGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

function isIosPermissionGranted(
  messaging: MessagingModule,
  status: FirebaseMessagingTypes.AuthorizationStatus,
): boolean {
  return (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function requestPushPermission(): Promise<boolean> {
  const messaging = getMessaging();

  if (!messaging) {
    return false;
  }

  if (Platform.OS === 'android') {
    return requestAndroidNotificationPermission();
  }

  const status = await messaging().requestPermission();
  return isIosPermissionGranted(messaging, status);
}

export async function getFcmToken(): Promise<string | null> {
  const messaging = getMessaging();

  if (!messaging) {
    return null;
  }

  const hasPermission = await requestPushPermission();

  if (!hasPermission) {
    return null;
  }

  return messaging().getToken();
}

export async function deleteFcmToken(): Promise<void> {
  const messaging = getMessaging();

  if (!messaging) {
    return;
  }

  await messaging().deleteToken();
}

export function onFcmTokenRefresh(listener: (token: string) => void): () => void {
  const messaging = getMessaging();

  if (!messaging) {
    return () => undefined;
  }

  return messaging().onTokenRefresh(listener);
}

export function onForegroundMessage(
  listener: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  const messaging = getMessaging();

  if (!messaging) {
    return () => undefined;
  }

  return messaging().onMessage(listener);
}

export function registerBackgroundMessageHandler(): void {
  const messaging = getMessaging();

  if (!messaging) {
    return;
  }

  messaging().setBackgroundMessageHandler(async () => {
    // Notification routing is handled when the user opens the app.
  });
}

export async function getInitialNotification(): Promise<FirebaseMessagingTypes.RemoteMessage | null> {
  const messaging = getMessaging();

  if (!messaging) {
    return null;
  }

  return messaging().getInitialNotification();
}

export function onNotificationOpenedApp(
  listener: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  const messaging = getMessaging();

  if (!messaging) {
    return () => undefined;
  }

  return messaging().onNotificationOpenedApp(listener);
}
