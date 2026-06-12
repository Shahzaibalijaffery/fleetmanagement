import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';

import type { DashboardData } from '../types/dashboard.types';

export const dashboardService = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardData>>('/dashboard').then((r) => r.data.data),
};
