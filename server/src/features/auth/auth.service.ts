import { env } from '../../config/env';
import { ConflictError, UnauthorizedError } from '../../shared/errors/AppError';
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

import type {
  AuthResponse,
  LoginInput,
  LogoutInput,
  PublicUser,
  RefreshTokenInput,
  RegisterInput,
  UserDocument,
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

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await hashPassword(input.password);

    const userDoc = await userRepository.create({
      name: input.name,
      email: input.email,
      password: passwordHash,
      role: input.role,
      phone: input.phone,
      ...(input.role === 'driver'
        ? { driverStatus: 'available' as const, carTypes: [] }
        : {}),
    });

    return issueTokens(userDoc.toObject() as UserDocument);
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
