import type { UserRole } from '@/features/auth/types/auth.types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  experience: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  city: string;
  experience?: number;
}
