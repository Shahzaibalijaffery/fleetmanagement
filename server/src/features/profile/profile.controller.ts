import type { NextFunction, Request, Response } from 'express';

import { profileService } from './profile.service';
import type { UpdateProfileInput } from './profile.types';

export const profileController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile(req.user!.id);
      res.json({ data: profile });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.updateProfile(
        req.user!.id,
        req.user!.role,
        req.body as UpdateProfileInput,
      );
      res.json({ data: profile });
    } catch (error) {
      next(error);
    }
  },
};
