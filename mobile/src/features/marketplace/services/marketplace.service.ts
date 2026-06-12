import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse } from '@/shared/api/types';

import type { MarketplaceCar, MarketplaceDriver, MarketplaceListParams } from '../types/marketplace.types';

const PAGE_LIMIT = 20;

export const marketplaceService = {
  listCars: (params: MarketplaceListParams) =>
    apiClient
      .get<PaginatedResponse<MarketplaceCar>>('/marketplace/cars', { params })
      .then((r) => r.data),

  listDrivers: (params: MarketplaceListParams) =>
    apiClient
      .get<PaginatedResponse<MarketplaceDriver>>('/marketplace/drivers', { params })
      .then((r) => r.data),
};

export const MARKETPLACE_PAGE_LIMIT = PAGE_LIMIT;
