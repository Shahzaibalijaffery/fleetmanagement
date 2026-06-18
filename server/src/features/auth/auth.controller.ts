import type { NextFunction, Request, Response } from 'express';

import { authService } from './auth.service';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyOtp(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resendOtp(req.body.email);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async completeOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.completeOnboarding(req.user!.id, req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async googleSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.googleSignIn(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refresh(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.body);
      res.json({ data: { message: 'Logged out successfully' } });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },
};
