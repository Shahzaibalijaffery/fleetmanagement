import { z } from 'zod';

import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SCHEDULE_TYPES,
} from '../contracts/contracts.types';

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
        message: 'Frequency is required for time-based items',
        path: ['frequency'],
      });
    }

    if (item.scheduleType === 'mileage' && !item.mileageIntervalKm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mileage interval is required for mileage-based items',
        path: ['mileageIntervalKm'],
      });
    }
  });

const carIdParamsSchema = z.object({
  carId: z.string().min(1, 'Car ID is required'),
});

export const updatePersonalMaintenanceSchema = z.object({
  params: carIdParamsSchema,
  body: z.object({
    personalMaintenanceChecklist: z
      .array(maintenanceItemSchema)
      .min(1, 'Add at least one maintenance item'),
  }),
});

export const updatePersonalOdometerSchema = z.object({
  params: carIdParamsSchema,
  body: z.object({
    personalCurrentOdometerKm: z.coerce.number().min(0, 'Odometer cannot be negative'),
  }),
});

export const completePersonalMaintenanceItemSchema = z.object({
  params: carIdParamsSchema.extend({
    itemId: z.string().min(1, 'Maintenance item ID is required'),
  }),
  body: z.object({
    cost: z.coerce.number().min(0, 'Cost must be 0 or greater'),
    personalCurrentOdometerKm: z.coerce.number().min(0).optional(),
  }),
});

const updatePersonalMaintenanceItemBodySchema = z
  .object({
    scheduleType: z.enum(MAINTENANCE_SCHEDULE_TYPES).optional(),
    frequency: z.enum(MAINTENANCE_FREQUENCIES).optional(),
    mileageIntervalKm: z.coerce.number().int().positive().optional(),
    lastCompletedAt: z
      .union([z.coerce.date(), z.literal(null)])
      .optional(),
    lastCompletedOdometerKm: z
      .union([z.coerce.number().min(0), z.literal(null)])
      .optional(),
  })
  .superRefine((body, ctx) => {
    const scheduleType = body.scheduleType;

    if (scheduleType === 'time' && body.frequency === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Frequency is required for time-based items',
        path: ['frequency'],
      });
    }

    if (scheduleType === 'mileage' && body.mileageIntervalKm === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mileage interval is required for mileage-based items',
        path: ['mileageIntervalKm'],
      });
    }
  });

export const updatePersonalMaintenanceItemSchema = z.object({
  params: carIdParamsSchema.extend({
    itemId: z.string().min(1, 'Maintenance item ID is required'),
  }),
  body: updatePersonalMaintenanceItemBodySchema,
});
