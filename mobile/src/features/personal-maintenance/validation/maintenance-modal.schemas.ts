import { z } from 'zod';

import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SCHEDULE_TYPES,
  type MaintenanceFrequency,
  type MaintenanceScheduleType,
} from '@/features/contracts/types/contracts.types';
import {
  mileageIntervalSchema,
  odometerSchema,
  optionalPastDateSchema,
} from '@/shared/validation/field.schemas';
import { parseDecimalInput, parseIntegerInput } from '@/shared/utils/numericInput';

export const completeMaintenanceFormSchema = z
  .object({
    cost: z.string().trim().min(1, 'Cost is required'),
    odometer: z.string().optional(),
    isMileageBased: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const parsedCost = parseDecimalInput(data.cost, -1);

    if (parsedCost <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid cost',
        path: ['cost'],
      });
    }

    if (!data.isMileageBased) {
      return;
    }

    const trimmedOdometer = data.odometer?.trim() ?? '';

    if (trimmedOdometer === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Odometer is required',
        path: ['odometer'],
      });
      return;
    }

    const parsedOdometer = parseIntegerInput(trimmedOdometer, -1);

    if (parsedOdometer < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid odometer reading',
        path: ['odometer'],
      });
    }
  });

export const editMaintenanceItemFormSchema = z
  .object({
    scheduleType: z.enum(MAINTENANCE_SCHEDULE_TYPES),
    frequency: z.enum(MAINTENANCE_FREQUENCIES).optional(),
    mileageIntervalKm: z.string().optional(),
    lastCompletedAt: optionalPastDateSchema,
    lastCompletedOdometerKm: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scheduleType === 'time' && !data.frequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Repeat frequency is required',
        path: ['frequency'],
      });
    }

    if (data.scheduleType === 'mileage') {
      const parsedInterval = parseIntegerInput(data.mileageIntervalKm ?? '', Number.NaN);

      if (Number.isNaN(parsedInterval)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Interval is required',
          path: ['mileageIntervalKm'],
        });
      } else {
        const intervalResult = mileageIntervalSchema.safeParse(parsedInterval);

        if (!intervalResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: intervalResult.error.issues[0]?.message ?? 'Invalid interval',
            path: ['mileageIntervalKm'],
          });
        }
      }

      const trimmedDate = data.lastCompletedAt?.trim() ?? '';

      if (trimmedDate) {
        const parsedOdometer = parseIntegerInput(data.lastCompletedOdometerKm ?? '', Number.NaN);
        const odometerResult = odometerSchema.safeParse(parsedOdometer);

        if (!odometerResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Odometer at last change is required',
            path: ['lastCompletedOdometerKm'],
          });
        }
      }
    }
  });

export type CompleteMaintenanceFormValues = z.infer<typeof completeMaintenanceFormSchema>;
export type EditMaintenanceItemFormValues = z.infer<typeof editMaintenanceItemFormSchema>;

export interface ResolvedEditMaintenanceValues {
  scheduleType: MaintenanceScheduleType;
  frequency?: MaintenanceFrequency;
  mileageIntervalKm?: number;
  lastCompletedAt: string | null;
  lastCompletedOdometerKm?: number | null;
}

export function resolveEditMaintenanceValues(
  values: EditMaintenanceItemFormValues,
): ResolvedEditMaintenanceValues {
  const trimmedDate = values.lastCompletedAt?.trim() ?? '';

  return {
    scheduleType: values.scheduleType,
    frequency: values.scheduleType === 'time' ? values.frequency : undefined,
    mileageIntervalKm:
      values.scheduleType === 'mileage'
        ? parseIntegerInput(values.mileageIntervalKm ?? '', 0)
        : undefined,
    lastCompletedAt: trimmedDate || null,
    lastCompletedOdometerKm:
      values.scheduleType === 'mileage' && trimmedDate
        ? parseIntegerInput(values.lastCompletedOdometerKm ?? '', 0)
        : null,
  };
}

import { odometerUpdateFormSchema } from '@/shared/validation/field.schemas';
