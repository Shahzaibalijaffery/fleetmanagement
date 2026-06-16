import { z } from 'zod';

import { endOfToday, isValidDateInput } from '@/shared/utils/dateInput';
import { parseIntegerInput } from '@/shared/utils/numericInput';

export const dateInputSchema = z
  .string()
  .trim()
  .min(1, 'Date is required')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Select a valid date')
  .refine(isValidDateInput, 'Select a valid date');

export const pastOrTodayDateSchema = dateInputSchema.refine(
  (value) => startOfDay(new Date(value)) <= endOfToday(),
  'Date cannot be in the future',
);

export const optionalPastDateSchema = z
  .string()
  .trim()
  .refine((value) => value === '' || isValidDateInput(value), 'Select a valid date')
  .refine(
    (value) => value === '' || startOfDay(new Date(value)) <= endOfToday(),
    'Date cannot be in the future',
  );

export const requiredTitleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(120, 'Title is too long');

export const optionalNotesSchema = z
  .string()
  .trim()
  .max(500, 'Notes are too long')
  .optional()
  .or(z.literal(''));

export const optionalVisitTitleSchema = z
  .string()
  .trim()
  .max(120, 'Title is too long')
  .optional()
  .or(z.literal(''));

export const requiredAmountSchema = z.coerce
  .number({ invalid_type_error: 'Amount is required' })
  .positive('Amount must be greater than 0');

export const nonNegativeAmountSchema = z.coerce
  .number({ invalid_type_error: 'Amount is required' })
  .min(0, 'Amount cannot be negative');

export const requiredRentAmountSchema = z.coerce
  .number({ invalid_type_error: 'Rent amount is required' })
  .positive('Rent amount must be greater than 0');

export const phoneSchema = z
  .string()
  .trim()
  .min(10, 'Phone must be at least 10 digits')
  .max(15, 'Phone is too long')
  .regex(/^[0-9+\s-]+$/, 'Use digits only');

export const personNameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(80, 'Name is too long');

export const citySchema = z
  .string()
  .trim()
  .min(2, 'City must be at least 2 characters')
  .max(80, 'City name is too long');

export const vehicleYearSchema = z.coerce
  .number({ invalid_type_error: 'Year is required' })
  .int('Year must be a whole number')
  .min(1900, 'Year must be 1900 or later')
  .max(new Date().getFullYear() + 1, 'Year is invalid');

export const registrationNumberSchema = z
  .string()
  .trim()
  .min(1, 'Registration number is required')
  .max(20, 'Registration number is too long');

export const brandSchema = z
  .string()
  .trim()
  .min(1, 'Brand is required')
  .max(50, 'Brand is too long');

export const modelSchema = z
  .string()
  .trim()
  .min(1, 'Model is required')
  .max(50, 'Model is too long');

export const odometerSchema = z.coerce
  .number({ invalid_type_error: 'Odometer is required' })
  .int('Odometer must be a whole number')
  .min(0, 'Odometer cannot be negative')
  .max(9_999_999, 'Odometer value is too large');

export const mileageIntervalSchema = z.coerce
  .number({ invalid_type_error: 'Interval is required' })
  .int('Interval must be a whole number')
  .min(100, 'Interval must be at least 100 km')
  .max(500_000, 'Interval is too large');

export const experienceYearsSchema = z.coerce
  .number({ invalid_type_error: 'Experience is required' })
  .int('Experience must be a whole number')
  .min(0, 'Experience cannot be negative')
  .max(50, 'Experience cannot exceed 50 years');

export const odometerInputStringSchema = z
  .string()
  .trim()
  .min(1, 'Odometer is required')
  .superRefine((value, ctx) => {
    const parsed = parseIntegerInput(value, Number.NaN);
    const result = odometerSchema.safeParse(parsed);

    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error.issues[0]?.message ?? 'Enter a valid odometer reading',
      });
    }
  });

export const odometerUpdateFormSchema = z.object({
  odometer: odometerInputStringSchema,
});

function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}
