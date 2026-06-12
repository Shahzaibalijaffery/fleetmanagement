import type { UserProfile } from '../types/profile.types';
import { DriverProfileForm } from './DriverProfileForm';
import { OwnerProfileForm } from './OwnerProfileForm';

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  if (profile.role === 'driver') {
    return <DriverProfileForm profile={profile} />;
  }

  return <OwnerProfileForm profile={profile} />;
}
