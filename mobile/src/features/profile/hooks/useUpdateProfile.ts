import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authKeys } from '@/features/auth/hooks/auth.keys';
import type { PublicUser } from '@/features/auth/types/auth.types';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { profileService } from '../services/profile.service';
import type { UpdateProfileRequest, UserProfile } from '../types/profile.types';
import { profileKeys } from './profile.keys';

function toPublicUser(profile: UserProfile): PublicUser {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    phone: profile.phone,
    city: profile.city,
    experience: profile.experience,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => profileService.updateProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(), profile);
      queryClient.setQueryData(authKeys.user(), toPublicUser(profile));
      setSession(toPublicUser(profile));
    },
    meta: { getErrorMessage },
  });
}
