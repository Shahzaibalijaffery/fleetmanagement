import { MonthlySalaryModel } from '../../models/monthly-salary.model';

export const monthlySalaryRepository = {
  findByOwnerAndMonth(ownerId: string, year: number, month: number) {
    return MonthlySalaryModel.findOne({ ownerId, year, month }).lean();
  },

  upsert(ownerId: string, year: number, month: number, amount: number) {
    return MonthlySalaryModel.findOneAndUpdate(
      { ownerId, year, month },
      { amount },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();
  },
};
