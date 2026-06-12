import { z } from 'zod';

export const expenseItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  amount: z.coerce.number().min(0, 'Amount must be 0 or greater'),
});

export const createExpenseFormSchema = z.object({
  expenseDate: z.string().trim().min(1, 'Date is required'),
  visitTitle: z.string().trim().optional(),
  items: z.array(expenseItemSchema).min(1, 'Add at least one expense item'),
});

export const addExpenseItemFormSchema = expenseItemSchema;

export const updateExpenseVisitFormSchema = z.object({
  expenseDate: z.string().trim().min(1, 'Date is required'),
  visitTitle: z.string().trim().optional(),
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseFormSchema>;
export type AddExpenseItemFormValues = z.infer<typeof addExpenseItemFormSchema>;
export type UpdateExpenseVisitFormValues = z.infer<typeof updateExpenseVisitFormSchema>;
export type EditExpenseItemFormValues = z.infer<typeof expenseItemSchema>;
