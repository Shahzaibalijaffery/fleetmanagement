import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

import { env } from './env';

function hasFirebaseCredentials(): boolean {
  return Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);
}

export function isFirebaseConfigured(): boolean {
  return hasFirebaseCredentials();
}

export function getFirebaseMessaging(): Messaging | null {
  if (!hasFirebaseCredentials()) {
    return null;
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID!,
        clientEmail: env.FIREBASE_CLIENT_EMAIL!,
        privateKey: env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
    });
  }

  return getMessaging();
}
