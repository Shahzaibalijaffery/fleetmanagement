import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { authService } from '../services/auth.service';
import type { RegisterRequest } from '../types/auth.types';
import { useAuthSession } from './useAuthSession';

export function useRegister() {
  const { establishSession } = useAuthSession();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: (data) => {
      establishSession(data.user, data.accessToken, data.refreshToken);
    },
    meta: { getErrorMessage },
  });
}
