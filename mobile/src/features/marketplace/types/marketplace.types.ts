export const CAR_TYPES = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'luxury'] as const;

export type CarType = (typeof CAR_TYPES)[number];

export const CAR_TYPE_LABELS: Record<CarType, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  hatchback: 'Hatchback',
  pickup: 'Pickup',
  van: 'Van',
  luxury: 'Luxury',
};

export const MARKETPLACE_RADIUS_KM_OPTIONS = [0, 10, 20, 30, 50] as const;

export type MarketplaceRadiusKm = (typeof MARKETPLACE_RADIUS_KM_OPTIONS)[number];

export const MARKETPLACE_RADIUS_LABELS: Record<MarketplaceRadiusKm, string> = {
  0: 'My city',
  10: '10 km',
  20: '20 km',
  30: '30 km',
  50: '50 km',
};

export interface MarketplaceCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  carType: CarType;
  createdAt: string;
}

export interface MarketplaceDriver {
  id: string;
  name: string;
  city: string | null;
  experience: number | null;
  carTypes: CarType[];
  createdAt: string;
}

export interface MarketplaceListParams {
  page: number;
  limit: number;
  radiusKm: MarketplaceRadiusKm;
  latitude?: number;
  longitude?: number;
  referenceCity?: string;
  carType?: CarType;
}

export interface MarketplaceFilters {
  radiusKm: MarketplaceRadiusKm;
  latitude?: number;
  longitude?: number;
  referenceCity?: string;
  carType?: CarType;
}
