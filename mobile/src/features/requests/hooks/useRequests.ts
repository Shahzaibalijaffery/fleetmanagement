import { useInfiniteQuery } from '@tanstack/react-query';

import { REQUESTS_PAGE_LIMIT, requestsService } from '../services/requests.service';
import type { RequestsListFilters } from '../types/requests.types';
import { requestsKeys } from './requests.keys';

export function useRequests(filters: RequestsListFilters = {}) {
  return useInfiniteQuery({
    queryKey: requestsKeys.list(filters),
    queryFn: ({ pageParam }) =>
      requestsService.listRequests({
        page: pageParam,
        limit: REQUESTS_PAGE_LIMIT,
        status: filters.status,
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
