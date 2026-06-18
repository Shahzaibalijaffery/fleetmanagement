import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { authService } from '../services/auth.service';
import type { ResendOtpRequest } from '../types/auth.types';

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpRequest) => authService.resendOtp(payload),
    meta: { getErrorMessage },
  });
}
