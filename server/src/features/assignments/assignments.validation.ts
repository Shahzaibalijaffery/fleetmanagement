import { z } from 'zod';

import { ASSIGNMENT_STATUSES } from './assignments.types';

export const listAssignmentsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(ASSIGNMENT_STATUSES).optional(),
    carId: z.string().min(1).optional(),
  }),
});

export const getAssignmentSchema = z.object({
  params: z.object({
    assignmentId: z.string().min(1, 'Assignment ID is required'),
  }),
});

export const getActiveForCarSchema = z.object({
  params: z.object({
    carId: z.string().min(1, 'Car ID is required'),
  }),
});
