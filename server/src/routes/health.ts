import type { Request, Response } from 'express';

import { env } from '../config/env';
import { notificationRemindersService } from '../features/notification-reminders/notification-reminders.service';
import type { ExpenseReminderSlot } from '../features/notification-reminders/notification-reminders.types';

function parseTestExpenseSlot(value: unknown): ExpenseReminderSlot | undefined {
  if (value === '22' || value === '23') {
    return value;
  }

  return undefined;
}

function parseTestForce(value: unknown): boolean {
  return value === 'true' || value === '1';
}

export function healthCheck(req: Request, res: Response) {
  const response: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  const options = env.NOTIFICATION_TEST_MODE
    ? {
        testExpenseSlot: parseTestExpenseSlot(req.query.testExpenseSlot),
        testForce: parseTestForce(req.query.testForce),
      }
    : undefined;

  if (options?.testExpenseSlot) {
    response.notificationTest = {
      expenseSlot: options.testExpenseSlot,
      force: options.testForce ?? false,
    };
  }

  res.json({ data: response });

  void notificationRemindersService.processReminders(options).catch((error) => {
    console.error('[notifications] Health check reminder processing failed:', error);
  });
}
