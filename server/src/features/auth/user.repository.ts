import { UserModel } from '../../models/user.model';

import type { CarType } from '../cars/cars.types';

import type { DriverStatus, UserDocument, UserRole } from './auth.types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  driverStatus?: DriverStatus;
  carTypes?: CarType[];
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

  findById(id: string) {
    return UserModel.findById(id).lean<UserDocument>();
  },

  updateDriverStatus(userId: string, driverStatus: DriverStatus) {
    return UserModel.findByIdAndUpdate(userId, { driverStatus }, { new: true }).lean<UserDocument>();
  },
};
