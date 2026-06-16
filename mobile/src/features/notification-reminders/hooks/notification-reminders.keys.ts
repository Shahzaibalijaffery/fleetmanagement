export const notificationRemindersKeys = {
  all: ['notification-reminders'] as const,
  preferences: () => [...notificationRemindersKeys.all, 'preferences'] as const,
};
