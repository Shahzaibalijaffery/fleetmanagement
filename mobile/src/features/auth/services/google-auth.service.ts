import { GOOGLE_WEB_CLIENT_ID } from '@env';

export function isGoogleSignInAvailable(): boolean {
  return Boolean(GOOGLE_WEB_CLIENT_ID?.trim());
}

export async function signInWithGoogle(): Promise<string> {
  if (!isGoogleSignInAvailable()) {
    throw new Error('Google sign-in is not configured');
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { GoogleSignin, isSuccessResponse } = require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin');

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  if (!isSuccessResponse(response) || !response.data.idToken) {
    throw new Error('Google sign-in was cancelled');
  }

  return response.data.idToken;
}
