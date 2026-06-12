import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { authService } from '../services/auth.service';
import type { ForgotPasswordRequest } from '../types/auth.types';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => authService.forgotPassword(payload),
    meta: { getErrorMessage },
  });
}
