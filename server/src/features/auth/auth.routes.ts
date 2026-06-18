import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authRateLimiter } from '../../middleware/rateLimiter';
import { validate } from '../../middleware/validate';

import { authController } from './auth.controller';
import {
  completeOnboardingSchema,
  forgotPasswordSchema,
  googleSignInSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  resendOtpSchema,
  verifyOtpSchema,
} from './auth.validation';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register,
);

router.post('/login', authRateLimiter, validate(loginSchema), authController.login);

router.post(
  '/verify-otp',
  authRateLimiter,
  validate(verifyOtpSchema),
  authController.verifyOtp,
);

router.post(
  '/resend-otp',
  authRateLimiter,
  validate(resendOtpSchema),
  authController.resendOtp,
);

router.post(
  '/google',
  authRateLimiter,
  validate(googleSignInSchema),
  authController.googleSignIn,
);

router.post(
  '/complete-onboarding',
  authenticate,
  validate(completeOnboardingSchema),
  authController.completeOnboarding,
);

router.post(
  '/refresh',
  authRateLimiter,
  validate(refreshTokenSchema),
  authController.refresh,
);

router.post(
  '/logout',
  authenticate,
  validate(logoutSchema),
  authController.logout,
);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

export { router as authRoutes };
