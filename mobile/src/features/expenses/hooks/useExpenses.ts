import { useInfiniteQuery } from '@tanstack/react-query';

import { EXPENSES_PAGE_LIMIT, expensesService } from '../services/expenses.service';
import type { ExpensesListFilters } from '../types/expenses.types';
import { expensesKeys } from './expenses.keys';

export function useExpenses(filters: ExpensesListFilters) {
  return useInfiniteQuery({
    queryKey: expensesKeys.list(filters),
    queryFn: ({ pageParam }) =>
      expensesService.listExpenses({
        page: pageParam,
        limit: EXPENSES_PAGE_LIMIT,
        includeCarExpenses: filters.includeCarExpenses,
        year: filters.year,
        month: filters.month,
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
