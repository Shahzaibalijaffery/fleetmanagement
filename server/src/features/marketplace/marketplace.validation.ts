import { z } from 'zod';

import { MARKETPLACE_RADIUS_KM_OPTIONS } from '../../shared/geo/marketplaceRadius';
import { CAR_TYPES } from '../cars/cars.types';

const listQuerySchema = z
  .object({
    page: z.string().optional(),
    limit: z.string().optional(),
    carType: z.enum(CAR_TYPES).optional(),
    radiusKm: z.coerce
      .number()
      .refine((value) => (MARKETPLACE_RADIUS_KM_OPTIONS as readonly number[]).includes(value), {
        message: 'radiusKm must be 0, 10, 20, 30, or 50',
      })
      .optional()
      .default(0),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    referenceCity: z.string().trim().min(2, 'referenceCity must be at least 2 characters').optional(),
  })
  .superRefine((data, ctx) => {
    const radiusKm = data.radiusKm ?? 0;

    if (radiusKm === 0) {
      if (!data.referenceCity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'referenceCity is required when searching within your city',
          path: ['referenceCity'],
        });
      }
      return;
    }

    if (data.latitude == null || data.longitude == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'latitude and longitude are required for distance search',
        path: ['latitude'],
      });
    }
  });

export const listMarketplaceCarsSchema = z.object({
  query: listQuerySchema,
});

export const listMarketplaceDriversSchema = z.object({
  query: listQuerySchema,
});
