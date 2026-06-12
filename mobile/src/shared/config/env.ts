import { Platform } from 'react-native';
import { APP_ENV, API_URL_LIVE, API_URL_LOCAL } from '@env';

export type AppEnv = 'local' | 'live';

const DEFAULT_LOCAL_HOST = Platform.select({
  android: '10.0.2.2',
  default: 'localhost',
});

const DEFAULT_LOCAL_API_URL = `http://${DEFAULT_LOCAL_HOST}:3000/api/v1`;

function resolveAppEnv(): AppEnv {
  return APP_ENV === 'live' ? 'live' : 'local';
}

function resolveApiUrl(appEnv: AppEnv): string {
  if (appEnv === 'live') {
    const liveUrl = API_URL_LIVE?.trim();

    if (!liveUrl || liveUrl.includes('your-service.onrender.com')) {
      console.warn(
        '[env] APP_ENV=live but API_URL_LIVE is not set. Update mobile/.env with your Render URL.',
      );
    }

    return liveUrl || DEFAULT_LOCAL_API_URL;
  }

  const localOverride = API_URL_LOCAL?.trim();
  return localOverride || DEFAULT_LOCAL_API_URL;
}

const appEnv = resolveAppEnv();
const apiUrl = resolveApiUrl(appEnv);

if (__DEV__) {
  console.log(`[FleetLink] APP_ENV=${appEnv} → ${apiUrl}`);
}

export const env = {
  APP_ENV: appEnv,
  API_URL: apiUrl,
  IS_LIVE: appEnv === 'live',
  IS_LOCAL: appEnv === 'local',
} as const;
