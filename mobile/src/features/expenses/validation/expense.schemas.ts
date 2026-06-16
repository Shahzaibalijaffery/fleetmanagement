import { z } from 'zod';

import {
  nonNegativeAmountSchema,
  optionalNotesSchema,
  pastOrTodayDateSchema,
  requiredAmountSchema,
  requiredTitleSchema,
} from '@/shared/validation/field.schemas';

export const createExpenseFormSchema = z.object({
  title: requiredTitleSchema,
  amount: requiredAmountSchema,
  expenseDate: pastOrTodayDateSchema,
  notes: optionalNotesSchema,
});

export const updateExpenseFormSchema = createExpenseFormSchema;

export const monthlySalaryFormSchema = z.object({
  amount: nonNegativeAmountSchema,
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseFormSchema>;
export type UpdateExpenseFormValues = z.infer<typeof updateExpenseFormSchema>;
export type MonthlySalaryFormValues = z.infer<typeof monthlySalaryFormSchema>;
