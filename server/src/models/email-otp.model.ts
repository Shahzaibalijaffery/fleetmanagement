import { Schema, model } from 'mongoose';

const emailOtpSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    codeHash: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

emailOtpSchema.index({ email: 1, createdAt: -1 });

export const EmailOtpModel = model('EmailOtp', emailOtpSchema);
