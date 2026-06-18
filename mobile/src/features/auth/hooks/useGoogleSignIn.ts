import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { signInWithGoogle } from '../services/google-auth.service';
import { authService } from '../services/auth.service';
import { useAuthSession } from './useAuthSession';

export function useGoogleSignIn() {
  const { establishSession } = useAuthSession();

  return useMutation({
    mutationFn: async () => {
      const idToken = await signInWithGoogle();
      return authService.googleSignIn({ idToken });
    },
    onSuccess: (data) => {
      establishSession(data.user, data.accessToken, data.refreshToken);
    },
    meta: { getErrorMessage },
  });
}
