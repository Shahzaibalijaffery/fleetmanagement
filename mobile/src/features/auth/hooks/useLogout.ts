import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { authService } from '../services/auth.service';
import { getRefreshToken } from '../services/token.storage';
import { useAuthSession } from './useAuthSession';

export function useLogout() {
  const { clearSession } = useAuthSession();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    },
    onSettled: () => {
      clearSession();
    },
    meta: { getErrorMessage },
  });
}
