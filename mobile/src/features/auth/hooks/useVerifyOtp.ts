import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { authService } from '../services/auth.service';
import type { VerifyOtpRequest } from '../types/auth.types';
import { useAuthSession } from './useAuthSession';

export function useVerifyOtp() {
  const { establishSession } = useAuthSession();

  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),
    onSuccess: (data) => {
      establishSession(data.user, data.accessToken, data.refreshToken);
    },
    meta: { getErrorMessage },
  });
}
