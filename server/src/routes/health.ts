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
    notificationTestModeEnabled: env.NOTIFICATION_TEST_MODE,
  };

  const hasTestQuery =
    req.query.testExpenseSlot !== undefined || req.query.testForce !== undefined;

  const testExpenseSlot = parseTestExpenseSlot(req.query.testExpenseSlot);
  const testForce = parseTestForce(req.query.testForce);

  const options = env.NOTIFICATION_TEST_MODE
    ? {
        testExpenseSlot,
        testForce,
      }
    : undefined;

  if (hasTestQuery) {
    response.notificationTest = {
      received: {
        testExpenseSlot: req.query.testExpenseSlot ?? null,
        testForce: req.query.testForce ?? null,
      },
      applied: Boolean(env.NOTIFICATION_TEST_MODE && testExpenseSlot),
      ...(env.NOTIFICATION_TEST_MODE && testExpenseSlot
        ? { expenseSlot: testExpenseSlot, force: testForce }
        : {}),
      ...(!env.NOTIFICATION_TEST_MODE
        ? {
            hint: 'Set NOTIFICATION_TEST_MODE=true on Render and redeploy to use test params',
          }
        : {}),
    };
  }

  res.json({ data: response });

  void notificationRemindersService
    .processReminders({
      source: 'health',
      ...options,
    })
    .catch((error) => {
      console.error('[notifications] Health check reminder processing failed:', error);
    });
}
