import { apiClient } from '@/shared/api/client';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';

import type { Assignment, ListAssignmentsParams } from '../types/assignments.types';

const PAGE_LIMIT = 20;

export const assignmentsService = {
  listAssignments: (params: ListAssignmentsParams) =>
    apiClient
      .get<PaginatedResponse<Assignment>>('/assignments', { params })
      .then((r) => r.data),

  getAssignment: (assignmentId: string) =>
    apiClient
      .get<ApiResponse<Assignment>>(`/assignments/${assignmentId}`)
      .then((r) => r.data.data),

  getMyActiveAssignment: () =>
    apiClient
      .get<ApiResponse<Assignment | null>>('/assignments/active/me')
      .then((r) => r.data.data),

  getActiveAssignmentForCar: (carId: string) =>
    apiClient
      .get<ApiResponse<Assignment | null>>(`/assignments/active/car/${carId}`)
      .then((r) => r.data.data),
};

export const ASSIGNMENTS_PAGE_LIMIT = PAGE_LIMIT;
