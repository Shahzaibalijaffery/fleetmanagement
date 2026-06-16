export const pushNotificationsKeys = {
  all: ['push-notifications'] as const,
  deviceToken: () => [...pushNotificationsKeys.all, 'device-token'] as const,
};
