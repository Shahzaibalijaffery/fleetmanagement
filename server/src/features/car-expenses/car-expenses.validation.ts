import { z } from 'zod';

const expenseItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  amount: z.coerce.number().min(0, 'Amount must be 0 or greater'),
});

const carIdParamsSchema = z.object({
  carId: z.string().min(1, 'Car ID is required'),
});

const logIdParamsSchema = carIdParamsSchema.extend({
  logId: z.string().min(1, 'Expense log ID is required'),
});

const itemIdParamsSchema = logIdParamsSchema.extend({
  itemId: z.string().min(1, 'Expense item ID is required'),
});

export const listCarExpensesSchema = z.object({
  params: carIdParamsSchema,
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const createCarExpenseSchema = z.object({
  params: carIdParamsSchema,
  body: z.object({
    expenseDate: z.string().trim().min(1, 'Expense date is required'),
    visitTitle: z.string().trim().optional(),
    items: z.array(expenseItemSchema).min(1, 'At least one expense item is required'),
  }),
});

export const updateCarExpenseSchema = z.object({
  params: logIdParamsSchema,
  body: z
    .object({
      expenseDate: z.string().trim().min(1, 'Expense date is required').optional(),
      visitTitle: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const addCarExpenseItemSchema = z.object({
  params: logIdParamsSchema,
  body: expenseItemSchema,
});

export const updateCarExpenseItemSchema = z.object({
  params: itemIdParamsSchema,
  body: expenseItemSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const removeCarExpenseItemSchema = z.object({
  params: itemIdParamsSchema,
});

export const deleteCarExpenseSchema = z.object({
  params: logIdParamsSchema,
});
