import { z } from 'zod';

const expenseIdParamsSchema = z.object({
  expenseId: z.string().min(1, 'Expense ID is required'),
});

export const listExpensesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    includeCarExpenses: z.string().optional(),
    year: z.string().optional(),
    month: z.string().optional(),
  }),
});

export const getExpenseSchema = z.object({
  params: expenseIdParamsSchema,
});

export const createExpenseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required'),
    amount: z.coerce.number().min(0, 'Amount must be 0 or greater'),
    expenseDate: z.string().trim().min(1, 'Expense date is required'),
    notes: z.string().trim().optional(),
  }),
});

export const updateExpenseSchema = z.object({
  params: expenseIdParamsSchema,
  body: z
    .object({
      title: z.string().trim().min(1, 'Title is required').optional(),
      amount: z.coerce.number().min(0, 'Amount must be 0 or greater').optional(),
      expenseDate: z.string().trim().min(1, 'Expense date is required').optional(),
      notes: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const deleteExpenseSchema = z.object({
  params: expenseIdParamsSchema,
});

export const setMonthlySalarySchema = z.object({
  body: z.object({
    year: z.coerce.number().int().min(2000).max(2100),
    month: z.coerce.number().int().min(1).max(12),
    amount: z.coerce.number().min(0, 'Salary must be 0 or greater'),
  }),
});
