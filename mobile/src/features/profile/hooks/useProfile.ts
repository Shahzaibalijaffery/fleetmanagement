import { useQuery } from '@tanstack/react-query';

import { profileService } from '../services/profile.service';
import { profileKeys } from './profile.keys';

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => profileService.getProfile(),
    staleTime: 2 * 60 * 1000,
  });
}
