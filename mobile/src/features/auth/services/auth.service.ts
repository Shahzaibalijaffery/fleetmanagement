import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';

import type {
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  RegisterRequest,
} from '../types/auth.types';

export const authService = {
  login: (payload: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload).then((r) => r.data.data),

  register: (payload: RegisterRequest) =>
    apiClient
      .post<ApiResponse<AuthResponse>>('/auth/register', payload)
      .then((r) => r.data.data),

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
