import { OAuth2Client } from 'google-auth-library';

import { env } from '../../config/env';
import { ValidationError } from '../../shared/errors/AppError';

const client = env.GOOGLE_WEB_CLIENT_ID ? new OAuth2Client(env.GOOGLE_WEB_CLIENT_ID) : null;

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  if (!client || !env.GOOGLE_WEB_CLIENT_ID) {
    throw new ValidationError('Google sign-in is not configured');
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_WEB_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    throw new ValidationError('Invalid Google token');
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name?.trim() || 'FleetLink User',
  };
}
