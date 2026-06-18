import type { NextFunction, Request, Response } from 'express';

import { notificationRemindersService } from '../notification-reminders/notification-reminders.service';
import type { DailyExpenseReminderSlot } from '../notification-reminders/notification-reminders.types';

export const cronController = {
  wake(_req: Request, res: Response) {
    res.json({
      data: {
        status: 'awake',
        timestamp: new Date().toISOString(),
      },
    });
  },

  async expenseReminders(req: Request, res: Response, next: NextFunction) {
    try {
      const slot = req.query.slot as DailyExpenseReminderSlot;

      await notificationRemindersService.sendDailyExpenseReminders(slot);

      res.json({
        data: {
          job: 'expense-reminders',
          slot,
          completedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async maintenanceReminders(_req: Request, res: Response, next: NextFunction) {
    try {
      await notificationRemindersService.sendMaintenanceReminders();

      res.json({
        data: {
          job: 'maintenance-reminders',
          completedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
