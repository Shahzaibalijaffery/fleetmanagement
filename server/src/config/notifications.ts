import { env } from './env';

export function areNotificationsEnabled(): boolean {
  return env.NOTIFICATIONS_ENABLED;
}
