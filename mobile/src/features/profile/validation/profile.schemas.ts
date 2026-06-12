import { z } from 'zod';

const baseProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits'),
  city: z.string().trim().min(2, 'City must be at least 2 characters'),
});

export const ownerProfileSchema = baseProfileSchema;

export const driverProfileSchema = baseProfileSchema.extend({
  experience: z.coerce
    .number({ invalid_type_error: 'Experience is required' })
    .int('Experience must be a whole number')
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years'),
});

export type OwnerProfileFormValues = z.infer<typeof ownerProfileSchema>;
export type DriverProfileFormValues = z.infer<typeof driverProfileSchema>;
