export const USER_ROLES = ['owner', 'driver'] as const;
export const AUTH_PROVIDERS = ['email', 'google'] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  experience: number | null;
  authProvider?: AuthProvider;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  needsOnboarding: boolean;
}

export interface OtpSentResponse {
  otpRequired: true;
  email: string;
  devOtpCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface CompleteOnboardingRequest {
  name: string;
  role: UserRole;
  phone?: string;
}

export interface GoogleSignInRequest {
  idToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}
