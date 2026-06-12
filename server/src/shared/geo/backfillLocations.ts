import { CarModel } from '../../models/car.model';
import { UserModel } from '../../models/user.model';

import { geocodeCity, toGeoPoint } from './cityGeocoder';

let backfillPromise: Promise<void> | null = null;

async function backfillLocations(): Promise<void> {
  const [cars, drivers] = await Promise.all([
    CarModel.find({
      $or: [{ location: { $exists: false } }, { location: null }],
    })
      .select('city')
      .lean<{ _id: { toString(): string }; city: string }[]>(),
    UserModel.find({
      role: 'driver',
      $or: [{ location: { $exists: false } }, { location: null }],
      city: { $ne: null },
    })
      .select('city')
      .lean<{ _id: { toString(): string }; city: string | null }[]>(),
  ]);

  await Promise.all([
    ...cars.map(async (car) => {
      const coords = geocodeCity(car.city);
      if (!coords) {
        return;
      }

      await CarModel.updateOne({ _id: car._id }, { location: toGeoPoint(coords) });
    }),
    ...drivers.map(async (driver) => {
      if (!driver.city) {
        return;
      }

      const coords = geocodeCity(driver.city);
      if (!coords) {
        return;
      }

      await UserModel.updateOne({ _id: driver._id }, { location: toGeoPoint(coords) });
    }),
  ]);
}

export function ensureMarketplaceLocationsBackfilled(): Promise<void> {
  if (!backfillPromise) {
    backfillPromise = backfillLocations().catch((error) => {
      backfillPromise = null;
      throw error;
    });
  }

  return backfillPromise;
}
