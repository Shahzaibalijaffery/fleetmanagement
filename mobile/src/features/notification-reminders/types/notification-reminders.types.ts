export interface NotificationPreferences {
  id: string;
  userId: string;
  dailyExpenseReminders: boolean;
  oilChangeReminders: boolean;
  carWashReminders: boolean;
  generalServiceReminders: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationPreferenceField =
  | 'dailyExpenseReminders'
  | 'oilChangeReminders'
  | 'carWashReminders'
  | 'generalServiceReminders';

export type UpdateNotificationPreferencesRequest = Partial<
  Pick<
    NotificationPreferences,
    | 'dailyExpenseReminders'
    | 'oilChangeReminders'
    | 'carWashReminders'
    | 'generalServiceReminders'
  >
>;
