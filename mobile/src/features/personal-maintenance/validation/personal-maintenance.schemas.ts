import { z } from 'zod';

import { mileageIntervalSchema, requiredTitleSchema } from '@/shared/validation/field.schemas';

import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SCHEDULE_TYPES,
} from '@/features/contracts/types/contracts.types';

const maintenanceItemSchema = z
  .object({
    title: requiredTitleSchema,
    scheduleType: z.enum(MAINTENANCE_SCHEDULE_TYPES),
    frequency: z.enum(MAINTENANCE_FREQUENCIES).optional(),
    mileageIntervalKm: mileageIntervalSchema.optional(),
  })
  .superRefine((item, ctx) => {
    if (item.scheduleType === 'time' && !item.frequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Frequency is required for time-based items',
        path: ['frequency'],
      });
    }

    if (item.scheduleType === 'mileage' && item.mileageIntervalKm == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mileage interval is required for mileage-based items',
        path: ['mileageIntervalKm'],
      });
    }
  });

export const personalMaintenanceFormSchema = z.object({
  personalMaintenanceChecklist: z
    .array(maintenanceItemSchema)
    .min(1, 'Add at least one maintenance item'),
});

export type PersonalMaintenanceFormValues = z.infer<typeof personalMaintenanceFormSchema>;
