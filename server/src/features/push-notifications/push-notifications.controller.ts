import type { NextFunction, Request, Response } from 'express';

import type { RegisterDeviceTokenInput, RemoveDeviceTokenInput } from './push-notifications.types';
import { pushNotificationsService } from './push-notifications.service';

export const pushNotificationsController = {
  async registerDeviceToken(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await pushNotificationsService.registerDeviceToken(
        req.user!.id,
        req.body as RegisterDeviceTokenInput,
      );
      res.status(201).json({ data: record });
    } catch (error) {
      next(error);
    }
  },

  async removeDeviceToken(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await pushNotificationsService.removeDeviceToken(
        req.user!.id,
        req.body as RemoveDeviceTokenInput,
      );
      res.json({ data: record });
    } catch (error) {
      next(error);
    }
  },
};
