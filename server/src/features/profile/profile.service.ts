import { NotFoundError, ValidationError } from '../../shared/errors/AppError';
import { geocodeCity, toGeoPoint } from '../../shared/geo/cityGeocoder';

import type { UserDocument, UserRole } from '../auth/auth.types';
import type { UpdateProfileInput, UserProfile } from './profile.types';
import { profileRepository } from './profile.repository';

function toUserProfile(user: UserDocument): UserProfile {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    city: user.city,
    experience: user.experience,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function validateProfileInput(role: UserRole, input: UpdateProfileInput): UpdateProfileInput {
  if (role === 'driver' && input.experience === undefined) {
    throw new ValidationError('Experience is required for drivers');
  }

  if (role === 'owner' && input.experience !== undefined) {
    throw new ValidationError('Experience is not applicable for owners');
  }

  return input;
}

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await profileRepository.findByUserId(userId);

    if (!user) {
      throw new NotFoundError('Profile not found');
    }

    return toUserProfile(user);
  },

  async updateProfile(
    userId: string,
    role: UserRole,
    input: UpdateProfileInput,
  ): Promise<UserProfile> {
    validateProfileInput(role, input);

    const city = input.city.trim();
    const coords = geocodeCity(city);

    const updateData = {
      name: input.name,
      phone: input.phone,
      city,
      location: coords ? toGeoPoint(coords) : null,
      experience: role === 'driver' ? input.experience ?? null : null,
    };

    const user = await profileRepository.updateByUserId(userId, updateData);

    if (!user) {
      throw new NotFoundError('Profile not found');
    }

    return toUserProfile(user);
  },
};
