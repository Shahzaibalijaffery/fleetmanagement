import { z } from 'zod';

import {
  citySchema,
  experienceYearsSchema,
  personNameSchema,
  phoneSchema,
} from '@/shared/validation/field.schemas';

const baseProfileSchema = z.object({
  name: personNameSchema,
  phone: phoneSchema,
  city: citySchema,
});

export const ownerProfileSchema = baseProfileSchema;

export const driverProfileSchema = baseProfileSchema.extend({
  experience: experienceYearsSchema,
});

export type OwnerProfileFormValues = z.infer<typeof ownerProfileSchema>;
export type DriverProfileFormValues = z.infer<typeof driverProfileSchema>;
