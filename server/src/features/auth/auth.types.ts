import type { CarType } from '../cars/cars.types';

export const USER_ROLES = ['owner', 'driver'] as const;
export const AUTH_PROVIDERS = ['email', 'google'] as const;

export const DRIVER_STATUSES = ['available', 'busy'] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];
export type DriverStatus = (typeof DRIVER_STATUSES)[number];

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyOtpInput {
  email: string;
  code: string;
}

export interface CompleteOnboardingInput {
  name: string;
  role: UserRole;
  phone?: string;
}

export interface GoogleSignInInput {
  idToken: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface LogoutInput {
  refreshToken: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface OtpSentResponse {
  otpRequired: true;
  email: string;
  devOtpCode?: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  experience: number | null;
  driverStatus: DriverStatus | null;
  carTypes: CarType[];
  authProvider: AuthProvider;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  needsOnboarding: boolean;
}

export interface UserDocument {
  _id: { toString(): string };
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  experience: number | null;
  driverStatus: DriverStatus | null;
  carTypes: CarType[];
  authProvider: AuthProvider;
  googleId: string | null;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenDocument {
  _id: { toString(): string };
  userId: { toString(): string };
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}
