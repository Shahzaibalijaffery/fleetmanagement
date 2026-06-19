export const MAINTENANCE_REMINDER_KEYS = [
  'oil_change',
  'car_wash',
  'general_service',
] as const;

export type MaintenanceReminderKey = (typeof MAINTENANCE_REMINDER_KEYS)[number];

export interface MaintenanceReminderRule {
  key: MaintenanceReminderKey;
  preferenceField: keyof NotificationPreferencesRecord;
  matchesTitle: (title: string) => boolean;
  dueAfterDays: number;
  repeatEveryDays: number;
}

export const MAINTENANCE_REMINDER_RULES: MaintenanceReminderRule[] = [
  {
    key: 'oil_change',
    preferenceField: 'oilChangeReminders',
    matchesTitle: (title) => title.toLowerCase().includes('oil'),
    dueAfterDays: 30,
    repeatEveryDays: 3,
  },
  {
    key: 'car_wash',
    preferenceField: 'carWashReminders',
    matchesTitle: (title) => title.toLowerCase().includes('wash'),
    dueAfterDays: 7,
    repeatEveryDays: 3,
  },
  {
    key: 'general_service',
    preferenceField: 'generalServiceReminders',
    matchesTitle: (title) => title.toLowerCase().includes('service'),
    dueAfterDays: 30,
    repeatEveryDays: 3,
  },
];

export interface NotificationPreferencesRecord {
  id: string;
  userId: string;
  dailyExpenseReminders: boolean;
  oilChangeReminders: boolean;
  carWashReminders: boolean;
  generalServiceReminders: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UpdateNotificationPreferencesInput = Partial<
  Pick<
    NotificationPreferencesRecord,
    | 'dailyExpenseReminders'
    | 'oilChangeReminders'
    | 'carWashReminders'
    | 'generalServiceReminders'
  >
>;
