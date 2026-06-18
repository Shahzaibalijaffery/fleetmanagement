import { EmailOtpModel } from '../../models/email-otp.model';
import { comparePassword, hashPassword } from '../../shared/utils/password';

const MAX_ATTEMPTS = 5;

export const emailOtpRepository = {
  async upsertCode(email: string, code: string, expiresAt: Date) {
    const codeHash = await hashPassword(code);

    await EmailOtpModel.deleteMany({ email });

    return EmailOtpModel.create({
      email,
      codeHash,
      expiresAt,
      attempts: 0,
    });
  },

  async findLatestWithHash(email: string) {
    return EmailOtpModel.findOne({ email })
      .sort({ createdAt: -1 })
      .select('+codeHash')
      .lean();
  },

  async incrementAttempts(id: string) {
    await EmailOtpModel.findByIdAndUpdate(id, { $inc: { attempts: 1 } });
  },

  async deleteByEmail(email: string) {
    await EmailOtpModel.deleteMany({ email });
  },

  async verifyCode(email: string, code: string) {
    const record = await this.findLatestWithHash(email);

    if (!record?.codeHash) {
      return { valid: false as const, reason: 'not_found' as const };
    }

    if (record.expiresAt.getTime() < Date.now()) {
      await this.deleteByEmail(email);
      return { valid: false as const, reason: 'expired' as const };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      return { valid: false as const, reason: 'max_attempts' as const };
    }

    const isMatch = await comparePassword(code, record.codeHash);

    if (!isMatch) {
      await this.incrementAttempts(record._id.toString());
      return { valid: false as const, reason: 'invalid' as const };
    }

    await this.deleteByEmail(email);
    return { valid: true as const };
  },
};
