import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { refreshSession } from '../services/refresh.service';
import { getRefreshToken, hasStoredSession } from '../services/token.storage';
import { useAuthSession } from './useAuthSession';

export function useAuthBootstrap() {
  const { establishSession, clearSession } = useAuthSession();

  return useMutation({
    mutationFn: async () => {
      if (!hasStoredSession()) {
        return null;
      }

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        return null;
      }

      return refreshSession(refreshToken);
    },
    onSuccess: (data) => {
      if (data) {
        establishSession(data.user, data.accessToken, data.refreshToken);
      }
    },
    onError: () => {
      clearSession();
    },
    meta: { getErrorMessage },
  });
}
