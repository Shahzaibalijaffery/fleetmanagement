import { useInfiniteQuery } from '@tanstack/react-query';

import {
  ASSIGNMENTS_PAGE_LIMIT,
  assignmentsService,
} from '../services/assignments.service';
import type { AssignmentsListFilters } from '../types/assignments.types';
import { assignmentsKeys } from './assignments.keys';

export function useAssignments(filters: AssignmentsListFilters = {}) {
  return useInfiniteQuery({
    queryKey: assignmentsKeys.list(filters),
    queryFn: ({ pageParam }) =>
      assignmentsService.listAssignments({
        page: pageParam,
        limit: ASSIGNMENTS_PAGE_LIMIT,
        status: filters.status,
        carId: filters.carId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    staleTime: 60 * 1000,
  });
}
