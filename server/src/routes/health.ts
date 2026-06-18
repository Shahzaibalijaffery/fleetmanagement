import type { Request, Response } from 'express';

import { notificationRemindersService } from '../features/notification-reminders/notification-reminders.service';

export function healthCheck(_req: Request, res: Response) {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });

  void notificationRemindersService.processReminders().catch((error) => {
    console.error('[notifications] Health check reminder processing failed:', error);
  });
}
