import { z } from 'zod';

import { CAR_STATUSES, CAR_TYPES } from '../types/cars.types';

export const carFormSchema = z.object({
  brand: z.string().trim().min(1, 'Brand is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.coerce
    .number()
    .int('Year must be a whole number')
    .min(1900, 'Year must be 1900 or later')
    .max(2100, 'Year is invalid'),
  registrationNumber: z.string().trim().min(1, 'Registration number is required'),
  city: z.string().trim().min(2, 'City must be at least 2 characters'),
  carType: z.enum(CAR_TYPES, { required_error: 'Car type is required' }),
  status: z.enum(CAR_STATUSES).optional(),
});

export type CarFormValues = z.infer<typeof carFormSchema>;
