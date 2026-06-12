import { z } from 'zod';

import { CAR_STATUSES, CAR_TYPES } from './cars.types';

const carFieldsSchema = z.object({
  brand: z.string().trim().min(1, 'Brand is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.coerce
    .number()
    .int('Year must be a whole number')
    .min(1900, 'Year must be 1900 or later')
    .max(2100, 'Year is invalid'),
  registrationNumber: z.string().trim().min(1, 'Registration number is required'),
  city: z.string().trim().min(2, 'City must be at least 2 characters'),
  carType: z.enum(CAR_TYPES),
  status: z.enum(CAR_STATUSES).optional(),
});

export const createCarSchema = z.object({
  body: carFieldsSchema,
});

export const updateCarSchema = z.object({
  params: z.object({
    carId: z.string().min(1, 'Car ID is required'),
  }),
  body: carFieldsSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  }),
});

export const getCarSchema = z.object({
  params: z.object({
    carId: z.string().min(1, 'Car ID is required'),
  }),
});

export const listCarsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(CAR_STATUSES).optional(),
  }),
});

export const deleteCarSchema = z.object({
  params: z.object({
    carId: z.string().min(1, 'Car ID is required'),
  }),
});
