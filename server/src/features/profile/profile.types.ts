import type { UserRole } from '../auth/auth.types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  experience: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileInput {
  name: string;
  phone: string;
  city: string;
  experience?: number;
}
