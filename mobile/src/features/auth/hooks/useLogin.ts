import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { authService } from '../services/auth.service';
import type { LoginRequest } from '../types/auth.types';
import { useAuthSession } from './useAuthSession';

export function useLogin() {
  const { establishSession } = useAuthSession();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (data) => {
      establishSession(data.user, data.accessToken, data.refreshToken);
    },
    meta: { getErrorMessage },
  });
}
