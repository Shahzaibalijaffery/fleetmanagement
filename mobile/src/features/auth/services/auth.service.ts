import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';

import type {
  AuthResponse,
  CompleteOnboardingRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleSignInRequest,
  LoginRequest,
  OtpSentResponse,
  RegisterRequest,
  ResendOtpRequest,
  VerifyOtpRequest,
} from '../types/auth.types';

export const authService = {
  login: (payload: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload).then((r) => r.data.data),

  register: (payload: RegisterRequest) =>
    apiClient
      .post<ApiResponse<OtpSentResponse>>('/auth/register', payload)
      .then((r) => r.data.data),

  verifyOtp: (payload: VerifyOtpRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-otp', payload).then((r) => r.data.data),

  resendOtp: (payload: ResendOtpRequest) =>
    apiClient.post<ApiResponse<OtpSentResponse>>('/auth/resend-otp', payload).then((r) => r.data.data),

  completeOnboarding: (payload: CompleteOnboardingRequest) =>
    apiClient
      .post<ApiResponse<AuthResponse>>('/auth/complete-onboarding', payload)
      .then((r) => r.data.data),

  googleSignIn: (payload: GoogleSignInRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/google', payload).then((r) => r.data.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken })
      .then((r) => r.data.data),

  logout: (refreshToken: string) =>
    apiClient
      .post<ApiResponse<{ message: string }>>('/auth/logout', { refreshToken })
      .then((r) => r.data.data),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    apiClient
      .post<ApiResponse<ForgotPasswordResponse>>('/auth/forgot-password', payload)
      .then((r) => r.data.data),
};
