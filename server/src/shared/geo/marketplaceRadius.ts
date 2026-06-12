export const MARKETPLACE_RADIUS_KM_OPTIONS = [0, 10, 20, 30, 50] as const;

export type MarketplaceRadiusKm = (typeof MARKETPLACE_RADIUS_KM_OPTIONS)[number];

export function isMarketplaceRadiusKm(value: number): value is MarketplaceRadiusKm {
  return (MARKETPLACE_RADIUS_KM_OPTIONS as readonly number[]).includes(value);
}
