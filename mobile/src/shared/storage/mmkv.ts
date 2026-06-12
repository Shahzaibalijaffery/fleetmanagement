import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'fleetlink-storage',
});

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  THEME_MODE: 'theme_mode',
  ONBOARDING_COMPLETE: 'onboarding_complete',
} as const;

export function getString(key: string): string | undefined {
  return storage.getString(key);
}

export function setString(key: string, value: string): void {
  storage.set(key, value);
}

export function remove(key: string): void {
  storage.delete(key);
}

export function clearAuthTokens(): void {
  remove(STORAGE_KEYS.ACCESS_TOKEN);
  remove(STORAGE_KEYS.REFRESH_TOKEN);
}
