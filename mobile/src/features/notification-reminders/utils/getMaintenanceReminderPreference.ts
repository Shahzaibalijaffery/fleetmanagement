import type { NotificationPreferenceField } from '../types/notification-reminders.types';

export function getMaintenanceReminderPreferenceField(
  title: string,
): NotificationPreferenceField | null {
  const lower = title.toLowerCase();

  if (lower.includes('oil')) {
    return 'oilChangeReminders';
  }

  if (lower.includes('wash')) {
    return 'carWashReminders';
  }

  if (lower.includes('service')) {
    return 'generalServiceReminders';
  }

  return null;
}

export function getMaintenanceReminderToggleLabel(field: NotificationPreferenceField): string {
  switch (field) {
    case 'oilChangeReminders':
      return 'Oil change reminders';
    case 'carWashReminders':
      return 'Car wash reminders';
    case 'generalServiceReminders':
      return 'Service reminders';
    default:
      return 'Reminders';
  }
}
