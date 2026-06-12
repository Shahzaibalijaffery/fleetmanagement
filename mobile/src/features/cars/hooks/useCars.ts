import { useInfiniteQuery } from '@tanstack/react-query';

import { CARS_PAGE_LIMIT, carsService } from '../services/cars.service';
import { carsKeys, type CarsListFilters } from './cars.keys';

export function useCars(filters: CarsListFilters = {}) {
  return useInfiniteQuery({
    queryKey: carsKeys.list(filters),
    queryFn: ({ pageParam }) =>
      carsService.listCars({
        page: pageParam,
        limit: CARS_PAGE_LIMIT,
        status: filters.status,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
}
