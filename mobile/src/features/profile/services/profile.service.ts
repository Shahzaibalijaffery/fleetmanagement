import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';

import type { UpdateProfileRequest, UserProfile } from '../types/profile.types';

export const profileService = {
  getProfile: () =>
    apiClient.get<ApiResponse<UserProfile>>('/profile').then((r) => r.data.data),

  updateProfile: (payload: UpdateProfileRequest) =>
    apiClient.patch<ApiResponse<UserProfile>>('/profile', payload).then((r) => r.data.data),
};
