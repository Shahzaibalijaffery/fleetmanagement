import type { Request, Response } from 'express';

import { env } from '../config/env';
import { notificationRemindersService } from '../features/notification-reminders/notification-reminders.service';
import {
  getExpenseReminderSlotConfigs,
  isValidExpenseReminderSlot,
  type ExpenseReminderSlot,
} from '../features/notification-reminders/expense-reminder-times.config';

function parseTestExpenseSlot(value: unknown): ExpenseReminderSlot | undefined {
  if (isValidExpenseReminderSlot(value)) {
    return value;
  }

  return undefined;
}

function parseTestForce(value: unknown): boolean {
  return value === 'true' || value === '1';
}

export function healthCheck(req: Request, res: Response) {
  const hasTestQuery =
    req.query.testExpenseSlot !== undefined || req.query.testForce !== undefined;

  const testExpenseSlot = parseTestExpenseSlot(req.query.testExpenseSlot);
  const testForce = parseTestForce(req.query.testForce);

  const response: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    notificationTestModeEnabled: env.NOTIFICATION_TEST_MODE,
    expenseReminderTimes: getExpenseReminderSlotConfigs().map((entry) => ({
      slot: entry.key,
      label: entry.label,
    })),
  };

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
            hint: 'Set NOTIFICATION_TEST_MODE=true to test a slot via /health?testExpenseSlot=1505',
          }
        : {}),
    };
  }

  res.json({ data: response });

  if (env.NOTIFICATION_TEST_MODE && hasTestQuery && testExpenseSlot) {
    void notificationRemindersService
      .processReminders({
        source: 'health-test',
        testExpenseSlot,
        testForce,
      })
      .catch((error) => {
        console.error('[notifications] Health test reminder processing failed:', error);
      });
  }
}
