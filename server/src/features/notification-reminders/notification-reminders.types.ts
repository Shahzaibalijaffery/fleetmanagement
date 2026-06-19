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

export type ExpenseReminderSlot = '22' | '23' | '1230' | '13';

export interface ExpenseReminderSlotConfig {
  key: ExpenseReminderSlot;
  label: string;
  sentAtField:
    | 'lastExpenseReminderSlot22At'
    | 'lastExpenseReminderSlot23At'
    | 'lastExpenseReminderSlot1230At'
    | 'lastExpenseReminderSlot13At';
}

export const EXPENSE_REMINDER_SLOT_CONFIGS: ExpenseReminderSlotConfig[] = [
  {
    key: '22',
    label: '10:00 PM',
    sentAtField: 'lastExpenseReminderSlot22At',
  },
  {
    key: '23',
    label: '11:00 PM',
    sentAtField: 'lastExpenseReminderSlot23At',
  },
  {
    key: '1230',
    label: '12:30 PM',
    sentAtField: 'lastExpenseReminderSlot1230At',
  },
  {
    key: '13',
    label: '1:00 PM',
    sentAtField: 'lastExpenseReminderSlot13At',
  },
];

export function getExpenseReminderSlotConfig(slot: ExpenseReminderSlot): ExpenseReminderSlotConfig {
  const config = EXPENSE_REMINDER_SLOT_CONFIGS.find((entry) => entry.key === slot);

  if (!config) {
    throw new Error(`Unknown expense reminder slot: ${slot}`);
  }

  return config;
}
