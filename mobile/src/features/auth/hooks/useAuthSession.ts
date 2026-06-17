import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/stores/auth.store';

import { authKeys } from './auth.keys';
import { saveTokens, clearTokens } from '../services/token.storage';
import type { PublicUser } from '../types/auth.types';

export function useAuthSession() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  const establishSession = (user: PublicUser, accessToken: string, refreshToken: string) => {
    saveTokens(accessToken, refreshToken);
    queryClient.setQueryData(authKeys.user(), user);
    setSession(user);
  };

  const clearSession = () => {
    clearTokens();
    queryClient.cancelQueries();
    queryClient.clear();
    setSession(null);
  };

  return { establishSession, clearSession };
}
