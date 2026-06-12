import { apiClient } from '@/shared/api/client';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';

import type { CarRequest, CreateRequestPayload, ListRequestsParams } from '../types/requests.types';

const PAGE_LIMIT = 20;

export const requestsService = {
  listRequests: (params: ListRequestsParams) =>
    apiClient
      .get<PaginatedResponse<CarRequest>>('/requests', { params })
      .then((r) => r.data),

  getRequest: (requestId: string) =>
    apiClient.get<ApiResponse<CarRequest>>(`/requests/${requestId}`).then((r) => r.data.data),

  createRequest: (payload: CreateRequestPayload) =>
    apiClient.post<ApiResponse<CarRequest>>('/requests', payload).then((r) => r.data.data),

  acceptRequest: (requestId: string) =>
    apiClient
      .post<ApiResponse<CarRequest>>(`/requests/${requestId}/accept`)
      .then((r) => r.data.data),

  rejectRequest: (requestId: string) =>
    apiClient
      .post<ApiResponse<CarRequest>>(`/requests/${requestId}/reject`)
      .then((r) => r.data.data),
};

export const REQUESTS_PAGE_LIMIT = PAGE_LIMIT;
