import type { CarType } from '../cars/cars.types';

export const USER_ROLES = ['owner', 'driver'] as const;

export const DRIVER_STATUSES = ['available', 'busy'] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type DriverStatus = (typeof DRIVER_STATUSES)[number];

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
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
