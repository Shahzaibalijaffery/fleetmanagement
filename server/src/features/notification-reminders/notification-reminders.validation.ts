import { z } from 'zod';

export const updateNotificationPreferencesSchema = z.object({
  body: z
    .object({
      dailyExpenseReminders: z.boolean().optional(),
      oilChangeReminders: z.boolean().optional(),
      carWashReminders: z.boolean().optional(),
      generalServiceReminders: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one preference is required',
    }),
});
