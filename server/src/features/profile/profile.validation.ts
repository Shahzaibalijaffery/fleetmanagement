import { z } from 'zod';

const profileFieldsSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits'),
  city: z.string().trim().min(2, 'City must be at least 2 characters'),
  experience: z.coerce
    .number()
    .int('Experience must be a whole number')
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years')
    .optional(),
});

export const updateProfileSchema = z.object({
  body: profileFieldsSchema,
});
