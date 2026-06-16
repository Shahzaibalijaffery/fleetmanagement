import { z } from 'zod';

import { PUSH_PLATFORMS } from './push-notifications.types';

export const registerDeviceTokenSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1, 'FCM token is required'),
    platform: z.enum(PUSH_PLATFORMS),
    deviceId: z.string().trim().min(1).optional(),
  }),
});

export const removeDeviceTokenSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1, 'FCM token is required'),
  }),
});
