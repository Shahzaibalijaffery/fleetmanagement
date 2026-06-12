import { z } from 'zod';

import {
  CONTRACT_MODES,
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SCHEDULE_TYPES,
  PAYMENT_FREQUENCIES,
  RESPONSIBILITY_PARTIES,
} from './contracts.types';

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

const contractBodySchema = z.object({
  contractMode: z.enum(CONTRACT_MODES),
  paymentFrequency: z.enum(PAYMENT_FREQUENCIES),
  rentAmount: z.coerce.number().min(0, 'Rent amount cannot be negative'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  fuelResponsibility: z.enum(RESPONSIBILITY_PARTIES),
  maintenanceResponsibility: z.enum(RESPONSIBILITY_PARTIES),
  damageResponsibility: z.enum(RESPONSIBILITY_PARTIES),
  initialOdometerKm: z.coerce.number().min(0).optional(),
  maintenanceChecklist: z.array(maintenanceItemSchema).optional(),
});

function validateContractBody<T extends z.infer<typeof contractBodySchema>>(data: T) {
  const items = data.maintenanceChecklist ?? [];
  const hasMileageItems = items.some((item) => item.scheduleType === 'mileage');

  if (hasMileageItems && data.initialOdometerKm == null) {
    return false;
  }

  return true;
}

export const createContractSchema = z.object({
  body: contractBodySchema
    .extend({
      assignmentId: z.string().min(1, 'Assignment ID is required'),
    })
    .refine(validateContractBody, {
      message: 'Initial odometer reading is required for mileage-based checklist items',
      path: ['initialOdometerKm'],
    }),
});

export const updateContractSchema = z.object({
  params: z.object({
    contractId: z.string().min(1, 'Contract ID is required'),
  }),
  body: contractBodySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    })
    .refine(validateContractBody, {
      message: 'Initial odometer reading is required for mileage-based checklist items',
      path: ['initialOdometerKm'],
    }),
});

export const updateContractOdometerSchema = z.object({
  params: z.object({
    contractId: z.string().min(1, 'Contract ID is required'),
  }),
  body: z.object({
    currentOdometerKm: z.coerce.number().min(0, 'Odometer cannot be negative'),
  }),
});

export const completeMaintenanceItemSchema = z.object({
  params: z.object({
    contractId: z.string().min(1, 'Contract ID is required'),
    itemId: z.string().min(1, 'Maintenance item ID is required'),
  }),
  body: z
    .object({
      currentOdometerKm: z.coerce.number().min(0).optional(),
    })
    .optional()
    .default({}),
});

export const listContractsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['active', 'ended']).optional(),
  }),
});

export const getContractSchema = z.object({
  params: z.object({
    contractId: z.string().min(1, 'Contract ID is required'),
  }),
});

export const getContractByAssignmentSchema = z.object({
  params: z.object({
    assignmentId: z.string().min(1, 'Assignment ID is required'),
  }),
});
