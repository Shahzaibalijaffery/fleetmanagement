import type { PersonalMaintenanceChecklistItem } from '@/features/cars/types/cars.types';

const STATUS_LABELS: Record<PersonalMaintenanceChecklistItem['status'], string> = {
  upcoming: 'Upcoming',
  due: 'Due now',
  overdue: 'Overdue',
};

export function getPersonalMaintenanceStatusLabel(
  status: PersonalMaintenanceChecklistItem['status'],
): string {
  return STATUS_LABELS[status];
}

export function getPersonalMaintenanceStatusVariant(
  status: PersonalMaintenanceChecklistItem['status'],
): 'error' | 'warning' | 'success' {
  switch (status) {
    case 'overdue':
      return 'error';
    case 'due':
      return 'warning';
    default:
      return 'success';
  }
}

export function formatPersonalMaintenanceDueText(item: PersonalMaintenanceChecklistItem): string {
  if (item.scheduleType === 'time' && item.nextDueDate) {
    return `Next due: ${item.nextDueDate.slice(0, 10)}`;
  }

  if (item.scheduleType === 'mileage' && item.nextDueOdometerKm != null) {
    return `Next due at: ${item.nextDueOdometerKm.toLocaleString()} km`;
  }

  return 'No upcoming due date';
}
