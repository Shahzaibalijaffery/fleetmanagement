import { ensureMarketplaceLocationsBackfilled } from '../../shared/geo/backfillLocations';
import { buildMeta } from '../../shared/types/pagination.types';

import type {
  MarketplaceCar,
  MarketplaceCarDocument,
  MarketplaceDriver,
  MarketplaceDriverDocument,
  MarketplaceListQuery,
} from './marketplace.types';
import { marketplaceRepository } from './marketplace.repository';

function toMarketplaceCar(car: MarketplaceCarDocument): MarketplaceCar {
  return {
    id: car._id.toString(),
    brand: car.brand,
    model: car.model,
    year: car.year,
    city: car.city,
    carType: car.carType,
    createdAt: car.createdAt,
  };
}

function toMarketplaceDriver(driver: MarketplaceDriverDocument): MarketplaceDriver {
  return {
    id: driver._id.toString(),
    name: driver.name,
    city: driver.city,
    experience: driver.experience,
    carTypes: driver.carTypes ?? [],
    createdAt: driver.createdAt,
  };
}

async function prepareDistanceSearch(query: MarketplaceListQuery) {
  if ((query.radiusKm ?? 0) > 0) {
    await ensureMarketplaceLocationsBackfilled();
  }
}

export const marketplaceService = {
  async listAvailableCars(query: MarketplaceListQuery) {
    await prepareDistanceSearch(query);

    const filter = {
      radiusKm: query.radiusKm,
      latitude: query.latitude,
      longitude: query.longitude,
      referenceCity: query.referenceCity,
      carType: query.carType,
    };
    const skip = (query.page - 1) * query.limit;

    const [cars, total] = await Promise.all([
      marketplaceRepository.findAvailableCars(filter, skip, query.limit),
      marketplaceRepository.countAvailableCars(filter),
    ]);

    return {
      data: cars.map(toMarketplaceCar),
      meta: buildMeta(query.page, query.limit, total),
    };
  },

  async listAvailableDrivers(query: MarketplaceListQuery) {
    await prepareDistanceSearch(query);

    const filter = {
      radiusKm: query.radiusKm,
      latitude: query.latitude,
      longitude: query.longitude,
      referenceCity: query.referenceCity,
      carType: query.carType,
    };
    const skip = (query.page - 1) * query.limit;

    const [drivers, total] = await Promise.all([
      marketplaceRepository.findAvailableDrivers(filter, skip, query.limit),
      marketplaceRepository.countAvailableDrivers(filter),
    ]);

    return {
      data: drivers.map(toMarketplaceDriver),
      meta: buildMeta(query.page, query.limit, total),
    };
  },
};
