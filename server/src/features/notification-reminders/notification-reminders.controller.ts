import type { NextFunction, Request, Response } from 'express';

import type { UpdateNotificationPreferencesInput } from './notification-reminders.types';
import { notificationRemindersService } from './notification-reminders.service';

export const notificationRemindersController = {
  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const preferences = await notificationRemindersService.getPreferences(req.user!.id);
      res.json({ data: preferences });
    } catch (error) {
      next(error);
    }
  },

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const preferences = await notificationRemindersService.updatePreferences(
        req.user!.id,
        req.body as UpdateNotificationPreferencesInput,
      );
      res.json({ data: preferences });
    } catch (error) {
      next(error);
    }
  },
};
