import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

import { getFirebaseCredentials } from './firebase-credentials';

export function isFirebaseConfigured(): boolean {
  return getFirebaseCredentials() !== null;
}

export function getFirebaseMessaging(): Messaging | null {
  const credentials = getFirebaseCredentials();

  if (!credentials) {
    return null;
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: credentials.projectId,
        clientEmail: credentials.clientEmail,
        privateKey: credentials.privateKey,
      }),
    });
  }

  return getMessaging();
}
