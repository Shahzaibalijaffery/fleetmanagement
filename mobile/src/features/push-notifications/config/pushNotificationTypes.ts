import type { PushNotificationType } from '../types/push-notifications.types';

export const PUSH_NOTIFICATION_TYPE_LABELS: Record<PushNotificationType, string> = {
  assignment_created: 'New assignment',
  assignment_accepted: 'Assignment accepted',
  contract_updated: 'Contract updated',
  maintenance_due: 'Maintenance due',
  request_received: 'New request',
  expense_reminder: 'Expense reminder',
  general: 'Notification',
};
