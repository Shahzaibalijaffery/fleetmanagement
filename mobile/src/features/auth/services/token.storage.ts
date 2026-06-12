import {
  clearAuthTokens,
  getString,
  setString,
  STORAGE_KEYS,
} from '@/shared/storage/mmkv';

export function getAccessToken(): string | undefined {
  return getString(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | undefined {
  return getString(STORAGE_KEYS.REFRESH_TOKEN);
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  setString(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setString(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

export function clearTokens(): void {
  clearAuthTokens();
}

export function hasStoredSession(): boolean {
  return Boolean(getAccessToken() && getRefreshToken());
}
