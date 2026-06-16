import { z } from 'zod';

import {
  optionalVisitTitleSchema,
  pastOrTodayDateSchema,
  requiredAmountSchema,
  requiredTitleSchema,
} from '@/shared/validation/field.schemas';

export const expenseItemSchema = z.object({
  title: requiredTitleSchema,
  amount: requiredAmountSchema,
});

export const createExpenseFormSchema = z.object({
  expenseDate: pastOrTodayDateSchema,
  visitTitle: optionalVisitTitleSchema,
  items: z.array(expenseItemSchema).min(1, 'Add at least one expense item'),
});

export const addExpenseItemFormSchema = expenseItemSchema;

export const updateExpenseVisitFormSchema = z.object({
  expenseDate: pastOrTodayDateSchema,
  visitTitle: optionalVisitTitleSchema,
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseFormSchema>;
export type AddExpenseItemFormValues = z.infer<typeof addExpenseItemFormSchema>;
export type UpdateExpenseVisitFormValues = z.infer<typeof updateExpenseVisitFormSchema>;
export type EditExpenseItemFormValues = z.infer<typeof expenseItemSchema>;
