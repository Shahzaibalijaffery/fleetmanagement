import { useMemo, useState } from 'react';

import type { UserCoordinates } from '@/shared/hooks/useUserLocation';

import type { CarType, MarketplaceFilters, MarketplaceRadiusKm } from '../types/marketplace.types';

interface UseMarketplaceFiltersOptions {
  coords: UserCoordinates | null;
  referenceCity?: string;
}

export function useMarketplaceFilters({ coords, referenceCity }: UseMarketplaceFiltersOptions) {
  const [radiusKm, setRadiusKm] = useState<MarketplaceRadiusKm>(0);
  const [carType, setCarType] = useState<CarType | undefined>();

  const filters = useMemo<MarketplaceFilters>(() => {
    if (radiusKm === 0) {
      return {
        radiusKm,
        referenceCity,
        carType,
      };
    }

    return {
      radiusKm,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      carType,
    };
  }, [radiusKm, referenceCity, coords, carType]);

  const hasActiveFilters = radiusKm !== 0 || Boolean(carType);

  const clearFilters = () => {
    setRadiusKm(0);
    setCarType(undefined);
  };

  const isReady =
    radiusKm === 0 ? Boolean(referenceCity) : Boolean(coords?.latitude && coords?.longitude);

  return {
    radiusKm,
    setRadiusKm,
    carType,
    setCarType,
    filters,
    hasActiveFilters,
    clearFilters,
    isReady,
  };
}
