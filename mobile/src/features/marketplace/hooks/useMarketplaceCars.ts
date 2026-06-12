import { useInfiniteQuery } from '@tanstack/react-query';

import {
  MARKETPLACE_PAGE_LIMIT,
  marketplaceService,
} from '../services/marketplace.service';
import type { MarketplaceFilters } from '../types/marketplace.types';
import { marketplaceKeys } from './marketplace.keys';

function isMarketplaceQueryReady(filters: MarketplaceFilters) {
  if (filters.radiusKm === 0) {
    return Boolean(filters.referenceCity);
  }

  return Boolean(filters.latitude != null && filters.longitude != null);
}

export function useMarketplaceCars(filters: MarketplaceFilters) {
  return useInfiniteQuery({
    queryKey: marketplaceKeys.carsList(filters),
    enabled: isMarketplaceQueryReady(filters),
    queryFn: ({ pageParam }) =>
      marketplaceService.listCars({
        page: pageParam,
        limit: MARKETPLACE_PAGE_LIMIT,
        radiusKm: filters.radiusKm,
        latitude: filters.latitude,
        longitude: filters.longitude,
        referenceCity: filters.referenceCity,
        carType: filters.carType,
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
