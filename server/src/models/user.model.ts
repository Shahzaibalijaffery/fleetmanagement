import { Schema, model } from 'mongoose';

import { DRIVER_STATUSES, USER_ROLES } from '../features/auth/auth.types';
import { CAR_TYPES } from '../features/cars/cars.types';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, required: true },
    phone: { type: String, trim: true, default: null },
    city: { type: String, trim: true, default: null },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    experience: { type: Number, min: 0, max: 50, default: null },
    driverStatus: { type: String, enum: DRIVER_STATUSES, default: null },
    carTypes: { type: [{ type: String, enum: CAR_TYPES }], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const { password: _password, ...safeUser } = ret;
        return safeUser;
      },
    },
    toObject: {
      transform(_doc, ret) {
        const { password: _password, ...safeUser } = ret;
        return safeUser;
      },
    },
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ role: 1, driverStatus: 1, city: 1 });
userSchema.index({ role: 1, driverStatus: 1, carTypes: 1 });
userSchema.index({ location: '2dsphere' });

export const UserModel = model('User', userSchema);
