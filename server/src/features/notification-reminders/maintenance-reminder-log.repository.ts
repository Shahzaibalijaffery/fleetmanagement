import { MaintenanceReminderLogModel } from '../../models/maintenance-reminder-log.model';

import type { MaintenanceReminderKey } from './notification-reminders.types';

export const maintenanceReminderLogRepository = {
  findByTarget(
    userId: string,
    carId: string,
    maintenanceItemId: string,
    reminderKey: MaintenanceReminderKey,
  ) {
    return MaintenanceReminderLogModel.findOne({
      userId,
      carId,
      maintenanceItemId,
      reminderKey,
    }).lean();
  },

  async upsertSent(
    userId: string,
    carId: string,
    maintenanceItemId: string,
    reminderKey: MaintenanceReminderKey,
    sentAt: Date,
  ) {
    return MaintenanceReminderLogModel.findOneAndUpdate(
      { userId, carId, maintenanceItemId, reminderKey },
      { userId, carId, maintenanceItemId, reminderKey, lastSentAt: sentAt },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
  },

  async deleteByCarAndItem(carId: string, maintenanceItemId: string) {
    await MaintenanceReminderLogModel.deleteMany({ carId, maintenanceItemId });
  },
};
