import { z } from 'zod';

import {
  CONTRACT_MODES,
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SCHEDULE_TYPES,
  PAYMENT_FREQUENCIES,
  RESPONSIBILITY_PARTIES,
} from '../types/contracts.types';

const dateSchema = z
  .string()
  .trim()
  .min(1, 'Date is required')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format');

const maintenanceItemSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    scheduleType: z.enum(MAINTENANCE_SCHEDULE_TYPES),
    frequency: z.enum(MAINTENANCE_FREQUENCIES).optional(),
    mileageIntervalKm: z.coerce.number().int().positive().optional(),
  })
  .superRefine((item, ctx) => {
    if (item.scheduleType === 'time' && !item.frequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Frequency is required',
        path: ['frequency'],
      });
    }

    if (item.scheduleType === 'mileage' && !item.mileageIntervalKm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mileage interval is required',
        path: ['mileageIntervalKm'],
      });
    }
  });

export const contractFormSchema = z
  .object({
    contractMode: z.enum(CONTRACT_MODES),
    paymentFrequency: z.enum(PAYMENT_FREQUENCIES),
    rentAmount: z.coerce.number().min(0, 'Rent amount cannot be negative'),
    startDate: dateSchema,
    endDate: dateSchema,
    fuelResponsibility: z.enum(RESPONSIBILITY_PARTIES),
    maintenanceResponsibility: z.enum(RESPONSIBILITY_PARTIES),
    damageResponsibility: z.enum(RESPONSIBILITY_PARTIES),
    initialOdometerKm: z.coerce.number().min(0).optional(),
    maintenanceChecklist: z.array(maintenanceItemSchema).min(1, 'Add at least one checklist item'),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .superRefine((data, ctx) => {
    const hasMileageItems = data.maintenanceChecklist.some(
      (item) => item.scheduleType === 'mileage',
    );

    if (hasMileageItems && data.initialOdometerKm == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Initial odometer is required for mileage-based items',
        path: ['initialOdometerKm'],
      });
    }
  });

export type ContractFormValues = z.infer<typeof contractFormSchema>;
