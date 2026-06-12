import type { MarketplaceFilters } from '../types/marketplace.types';

export const marketplaceKeys = {
  all: ['marketplace'] as const,
  cars: () => [...marketplaceKeys.all, 'cars'] as const,
  carsList: (filters: MarketplaceFilters) => [...marketplaceKeys.cars(), filters] as const,
  drivers: () => [...marketplaceKeys.all, 'drivers'] as const,
  driversList: (filters: MarketplaceFilters) => [...marketplaceKeys.drivers(), filters] as const,
};
