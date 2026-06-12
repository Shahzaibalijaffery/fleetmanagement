import { CarModel } from '../../models/car.model';
import { UserModel } from '../../models/user.model';

import type {
  MarketplaceCarDocument,
  MarketplaceCarFilter,
  MarketplaceDriverDocument,
  MarketplaceDriverFilter,
} from './marketplace.types';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const EARTH_RADIUS_KM = 6378.1;

function buildCityFilter(city: string) {
  return { $regex: new RegExp(`^${escapeRegExp(city.trim())}$`, 'i') };
}

function buildLocationQuery(filter: MarketplaceCarFilter | MarketplaceDriverFilter) {
  const radiusKm = filter.radiusKm ?? 0;

  if (radiusKm === 0) {
    if (!filter.referenceCity?.trim()) {
      return {};
    }

    return { city: buildCityFilter(filter.referenceCity) };
  }

  if (filter.latitude == null || filter.longitude == null) {
    return {};
  }

  const radiusRadians = radiusKm / EARTH_RADIUS_KM;

  return {
    location: {
      $geoWithin: {
        $centerSphere: [[filter.longitude, filter.latitude], radiusRadians],
      },
    },
  };
}

function buildCarFilter(filter: MarketplaceCarFilter) {
  const query: Record<string, unknown> = {
    status: 'available',
    ...buildLocationQuery(filter),
  };

  if (filter.carType) {
    query.carType = filter.carType;
  }

  return query;
}

function buildDriverFilter(filter: MarketplaceDriverFilter) {
  const query: Record<string, unknown> = {
    role: 'driver',
    driverStatus: 'available',
    ...buildLocationQuery(filter),
  };

  if (filter.carType) {
    query.carTypes = filter.carType;
  }

  return query;
}

export const marketplaceRepository = {
  findAvailableCars(filter: MarketplaceCarFilter, skip: number, limit: number) {
    const query = buildCarFilter(filter);

    return CarModel.find(query)
      .select('brand model year city carType createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<MarketplaceCarDocument[]>();
  },

  countAvailableCars(filter: MarketplaceCarFilter) {
    return CarModel.countDocuments(buildCarFilter(filter));
  },

  findAvailableDrivers(filter: MarketplaceDriverFilter, skip: number, limit: number) {
    const query = buildDriverFilter(filter);

    return UserModel.find(query)
      .select('name city experience carTypes createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<MarketplaceDriverDocument[]>();
  },

  countAvailableDrivers(filter: MarketplaceDriverFilter) {
    return UserModel.countDocuments(buildDriverFilter(filter));
  },
};
