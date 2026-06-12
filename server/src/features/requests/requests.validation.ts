import { z } from 'zod';

import { REQUEST_STATUSES } from './requests.types';

export const createRequestSchema = z.object({
  body: z.object({
    carId: z.string().min(1, 'Car ID is required'),
  }),
});

export const listRequestsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(REQUEST_STATUSES).optional(),
  }),
});

export const getRequestSchema = z.object({
  params: z.object({
    requestId: z.string().min(1, 'Request ID is required'),
  }),
});

export const requestActionSchema = z.object({
  params: z.object({
    requestId: z.string().min(1, 'Request ID is required'),
  }),
});
