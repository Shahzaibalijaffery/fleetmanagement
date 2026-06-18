import type { AuthProvider, DriverStatus, UserDocument, UserRole } from './auth.types';
import { UserModel } from '../../models/user.model';

import type { CarType } from '../cars/cars.types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  authProvider?: AuthProvider;
  googleId?: string | null;
  isOnboarded?: boolean;
  driverStatus?: DriverStatus;
  carTypes?: CarType[];
}

export interface CompleteOnboardingData {
  name: string;
  role: UserRole;
  phone?: string;
}

export const userRepository = {
  create(data: CreateUserData) {
    return UserModel.create(data);
  },

  findByEmail(email: string) {
    return UserModel.findOne({ email }).lean<UserDocument>();
  },

  findByEmailWithPassword(email: string) {
    return UserModel.findOne({ email }).select('+password').lean<UserDocument>();
  },

  findByGoogleId(googleId: string) {
    return UserModel.findOne({ googleId }).lean<UserDocument>();
  },

  findById(id: string) {
    return UserModel.findById(id).lean<UserDocument>();
  },

  updateDriverStatus(userId: string, driverStatus: DriverStatus) {
    return UserModel.findByIdAndUpdate(userId, { driverStatus }, { new: true }).lean<UserDocument>();
  },

  completeOnboarding(userId: string, data: CompleteOnboardingData) {
    const update: Record<string, unknown> = {
      name: data.name,
      role: data.role,
      phone: data.phone ?? null,
      isOnboarded: true,
    };

    if (data.role === 'driver') {
      update.driverStatus = 'available';
      update.carTypes = [];
    }

    return UserModel.findByIdAndUpdate(userId, update, { new: true }).lean<UserDocument>();
  },

  linkGoogleAccount(userId: string, googleId: string) {
    return UserModel.findByIdAndUpdate(
      userId,
      { googleId, authProvider: 'google' },
      { new: true },
    ).lean<UserDocument>();
  },
};
