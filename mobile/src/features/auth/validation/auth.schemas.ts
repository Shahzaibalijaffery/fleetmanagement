import { z } from 'zod';

import { personNameSchema, phoneSchema } from '@/shared/validation/field.schemas';

import { USER_ROLES } from '../types/auth.types';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: z.string().trim().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const verifyOtpSchema = z.object({
  code: z.string().trim().length(6, 'Enter the 6-digit code'),
});

export const onboardingNameSchema = z.object({
  name: personNameSchema,
});

export const onboardingPhoneSchema = z.object({
  phone: z.union([z.literal(''), phoneSchema]).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
export type OnboardingNameFormValues = z.infer<typeof onboardingNameSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type OnboardingRole = (typeof USER_ROLES)[number];
