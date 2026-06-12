import { z } from 'zod';

import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SCHEDULE_TYPES,
} from '../contracts/contracts.types';
import { hasMileagePersonalItems } from './personal-maintenance.utils';

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
  body: z
    .object({
      personalInitialOdometerKm: z.coerce.number().min(0).optional(),
      personalMaintenanceChecklist: z
        .array(maintenanceItemSchema)
        .min(1, 'Add at least one maintenance item'),
    })
    .superRefine((data, ctx) => {
      if (
        hasMileagePersonalItems(data.personalMaintenanceChecklist) &&
        data.personalInitialOdometerKm == null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Initial odometer is required when using mileage-based items',
          path: ['personalInitialOdometerKm'],
        });
      }
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
    personalCurrentOdometerKm: z.coerce.number().min(0).optional(),
  }),
});
