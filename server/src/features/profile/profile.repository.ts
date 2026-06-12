import { UserModel } from '../../models/user.model';

import type { UserDocument } from '../auth/auth.types';

export interface UpdateProfileData {
  name: string;
  phone: string;
  city: string;
  location?: { type: 'Point'; coordinates: [number, number] } | null;
  experience: number | null;
}

export const profileRepository = {
  findByUserId(userId: string) {
    return UserModel.findById(userId).lean<UserDocument>();
  },

  updateByUserId(userId: string, data: UpdateProfileData) {
    return UserModel.findByIdAndUpdate(userId, data, { new: true }).lean<UserDocument>();
  },
};
