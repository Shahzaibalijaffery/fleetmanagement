import axios from 'axios';

import { env } from '@/shared/config/env';
import type { ApiResponse } from '@/shared/api/types';

import type { AuthResponse } from '../types/auth.types';

const refreshClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  const response = await refreshClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
    refreshToken,
  });
  return response.data.data;
}
