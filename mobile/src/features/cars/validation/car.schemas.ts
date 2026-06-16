import { z } from 'zod';

import {
  brandSchema,
  citySchema,
  modelSchema,
  registrationNumberSchema,
  vehicleYearSchema,
} from '@/shared/validation/field.schemas';

import { CAR_STATUSES, CAR_TYPES } from '../types/cars.types';

export const carFormSchema = z.object({
  brand: brandSchema,
  model: modelSchema,
  year: vehicleYearSchema,
  registrationNumber: registrationNumberSchema,
  city: citySchema,
  carType: z.enum(CAR_TYPES, { required_error: 'Car type is required' }),
  status: z.enum(CAR_STATUSES).optional(),
});

export type CarFormValues = z.infer<typeof carFormSchema>;
