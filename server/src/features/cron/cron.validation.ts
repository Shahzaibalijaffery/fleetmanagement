import { z } from 'zod';

export const expenseReminderCronSchema = z.object({
  query: z.object({
    slot: z.enum(['22', '23'], {
      errorMap: () => ({ message: 'slot must be 22 or 23' }),
    }),
  }),
});
