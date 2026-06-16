import { Types } from 'mongoose';

import { CarModel } from '../../models/car.model';
import { ContractModel } from '../../models/contract.model';
import { ExpenseModel } from '../../models/expense.model';
import { UserModel } from '../../models/user.model';

export const notificationRemindersRepository = {
  findOwnerIds() {
    return UserModel.find({ role: 'owner' }).select('_id').lean();
  },

  findPersonalUseCars() {
    return CarModel.find({ status: 'personal_use' }).lean();
  },

  findActiveContractsForMaintenanceReminders() {
    return ContractModel.find({ status: 'active' })
      .populate({ path: 'carId', select: 'brand model registrationNumber' })
      .lean();
  },

  async hasGeneralExpenseInRange(ownerId: string, start: Date, end: Date) {
    const exists = await ExpenseModel.exists({
      ownerId: new Types.ObjectId(ownerId),
      source: 'general',
      expenseDate: { $gte: start, $lt: end },
    });

    return Boolean(exists);
  },
};
