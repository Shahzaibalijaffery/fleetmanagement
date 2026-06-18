import { randomBytes } from 'crypto';

import { env } from '../../config/env';
import { ConflictError, UnauthorizedError, ValidationError } from '../../shared/errors/AppError';
import { sendOtpEmail, isEmailConfigured } from '../../shared/services/email.service';
import { generateOtpCode, getOtpExpiryDate } from '../../shared/utils/otp';
import { parseDurationToMs } from '../../shared/utils/duration';
import { signAccessToken } from '../../shared/utils/jwt';
import { comparePassword, hashPassword } from '../../shared/utils/password';
import {
  buildRefreshToken,
  compareRefreshTokenSecret,
  generateRefreshTokenSecret,
  hashRefreshTokenSecret,
  parseRefreshToken,
} from '../../shared/utils/refreshToken';

import { emailOtpRepository } from './email-otp.repository';
import { verifyGoogleIdToken } from './google-auth.service';
import type {
  AuthResponse,
  CompleteOnboardingInput,
  GoogleSignInInput,
  LoginInput,
  LogoutInput,
  OtpSentResponse,
  PublicUser,
  RefreshTokenInput,
  RegisterInput,
  UserDocument,
  VerifyOtpInput,
} from './auth.types';
import { refreshTokenRepository } from './refresh-token.repository';
import { userRepository } from './user.repository';

function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    city: user.city,
    experience: user.experience,
    driverStatus: user.driverStatus,
    carTypes: user.carTypes ?? [],
    authProvider: user.authProvider ?? 'email',
    isOnboarded: user.isOnboarded !== false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function issueTokens(user: UserDocument): Promise<AuthResponse> {
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  const secret = await generateRefreshTokenSecret();
  const tokenHash = await hashRefreshTokenSecret(secret);
  const expiresAt = new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN));

  const refreshTokenDoc = await refreshTokenRepository.create({
    userId: user._id.toString(),
    tokenHash,
    expiresAt,
  });

  const refreshToken = buildRefreshToken(refreshTokenDoc._id.toString(), secret);

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken,
    needsOnboarding: user.isOnboarded === false,
  };
}

async function validateRefreshToken(refreshToken: string) {
  let tokenId: string;
  let secret: string;

  try {
    ({ tokenId, secret } = parseRefreshToken(refreshToken));
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const storedToken = await refreshTokenRepository.findById(tokenId);

  if (!storedToken || storedToken.revokedAt) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (storedToken.expiresAt.getTime() < Date.now()) {
    throw new UnauthorizedError('Refresh token expired');
  }

  const isValid = await compareRefreshTokenSecret(secret, storedToken.tokenHash);

  if (!isValid) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  return { tokenId, userId: storedToken.userId.toString() };
}

async function sendRegistrationOtp(email: string): Promise<OtpSentResponse> {
  const code = generateOtpCode();

  await emailOtpRepository.upsertCode(email, code, getOtpExpiryDate());
  await sendOtpEmail(email, code);

  const exposeDevCode =
    !isEmailConfigured() && (env.AUTH_OTP_DEV_EXPOSE || env.NODE_ENV === 'development');

  return {
    otpRequired: true,
    email,
    ...(exposeDevCode ? { devOtpCode: code } : {}),
  };
}

function mapOtpFailure(reason: string): never {
  switch (reason) {
    case 'expired':
      throw new ValidationError('Verification code expired. Request a new one.');
    case 'max_attempts':
      throw new ValidationError('Too many attempts. Request a new code.');
    case 'invalid':
      throw new ValidationError('Invalid verification code');
    default:
      throw new ValidationError('Verification code not found. Sign in again.');
  }
}

async function createEmailUser(email: string, password: string) {
  const passwordHash = await hashPassword(password);

  return userRepository.create({
    name: 'FleetLink User',
    email,
    password: passwordHash,
    role: 'owner',
    authProvider: 'email',
    isOnboarded: false,
  });
}

export const authService = {
  async register(input: RegisterInput): Promise<OtpSentResponse> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    await createEmailUser(input.email, input.password);
    return sendRegistrationOtp(input.email);
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await userRepository.findByEmailWithPassword(input.email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await comparePassword(input.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return issueTokens(user);
  },

  async verifyOtp(input: VerifyOtpInput): Promise<AuthResponse> {
    const result = await emailOtpRepository.verifyCode(input.email, input.code);

    if (!result.valid) {
      mapOtpFailure(result.reason);
    }

    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('Account not found');
    }

    return issueTokens(user);
  },

  async resendOtp(email: string): Promise<OtpSentResponse> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Account not found');
    }

    return sendRegistrationOtp(email);
  },

  async completeOnboarding(userId: string, input: CompleteOnboardingInput): Promise<AuthResponse> {
    const user = await userRepository.completeOnboarding(userId, input);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return issueTokens(user);
  },

  async googleSignIn(input: GoogleSignInInput): Promise<AuthResponse> {
    const profile = await verifyGoogleIdToken(input.idToken);

    let user = await userRepository.findByGoogleId(profile.googleId);

    if (!user) {
      const existingByEmail = await userRepository.findByEmail(profile.email);

      if (existingByEmail) {
        user = await userRepository.linkGoogleAccount(existingByEmail._id.toString(), profile.googleId);
      } else {
        const randomPassword = await hashPassword(randomBytes(32).toString('hex'));
        const created = await userRepository.create({
          name: profile.name,
          email: profile.email,
          password: randomPassword,
          role: 'owner',
          authProvider: 'google',
          googleId: profile.googleId,
          isOnboarded: false,
        });

        user = created.toObject() as UserDocument;
      }
    }

    if (!user) {
      throw new UnauthorizedError('Unable to sign in with Google');
    }

    return issueTokens(user);
  },

  async refresh(input: RefreshTokenInput): Promise<AuthResponse> {
    const { tokenId, userId } = await validateRefreshToken(input.refreshToken);

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    await refreshTokenRepository.revokeById(tokenId);

    return issueTokens(user);
  },

  async logout(input: LogoutInput): Promise<void> {
    const { tokenId } = await validateRefreshToken(input.refreshToken);
    await refreshTokenRepository.revokeById(tokenId);
  },

  async forgotPassword(_input: { email: string }): Promise<{ message: string }> {
    return {
      message:
        'If an account exists for this email, you will receive password reset instructions shortly.',
    };
  },
};
