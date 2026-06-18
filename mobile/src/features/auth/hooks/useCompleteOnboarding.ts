import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { authService } from '../services/auth.service';
import type { CompleteOnboardingRequest } from '../types/auth.types';
import { useAuthSession } from './useAuthSession';

export function useCompleteOnboarding() {
  const { establishSession } = useAuthSession();

  return useMutation({
    mutationFn: (payload: CompleteOnboardingRequest) => authService.completeOnboarding(payload),
    onSuccess: (data) => {
      establishSession(data.user, data.accessToken, data.refreshToken);
    },
    meta: { getErrorMessage },
  });
}
