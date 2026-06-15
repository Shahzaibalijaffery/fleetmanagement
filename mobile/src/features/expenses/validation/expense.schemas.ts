import { z } from 'zod';

export const createExpenseFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  amount: z.coerce.number().min(0, 'Amount must be 0 or greater'),
  expenseDate: z.string().trim().min(1, 'Expense date is required'),
  notes: z.string().trim().optional(),
});

export const updateExpenseFormSchema = createExpenseFormSchema;

export type CreateExpenseFormValues = z.infer<typeof createExpenseFormSchema>;
export type UpdateExpenseFormValues = z.infer<typeof updateExpenseFormSchema>;
