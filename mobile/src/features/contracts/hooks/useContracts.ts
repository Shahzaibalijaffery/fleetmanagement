import { useInfiniteQuery } from '@tanstack/react-query';

import { CONTRACTS_PAGE_LIMIT, contractsService } from '../services/contracts.service';
import type { ContractsListFilters } from '../types/contracts.types';
import { contractsKeys } from './contracts.keys';

export function useContracts(filters: ContractsListFilters = {}) {
  return useInfiniteQuery({
    queryKey: contractsKeys.list(filters),
    queryFn: ({ pageParam }) =>
      contractsService.listContracts({
        page: pageParam,
        limit: CONTRACTS_PAGE_LIMIT,
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
