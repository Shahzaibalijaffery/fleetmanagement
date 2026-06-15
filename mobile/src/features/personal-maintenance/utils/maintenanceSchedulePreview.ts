import type { MaintenanceFrequency, MaintenanceScheduleType } from '@/features/contracts/types/contracts.types';
import { formatExpenseDate } from '@/shared/utils/formatExpenseDate';

function addMaintenanceInterval(date: Date, frequency: MaintenanceFrequency): Date {
  const result = new Date(date);

  switch (frequency) {
    case 'daily':
      result.setDate(result.getDate() + 1);
      break;
    case 'weekly':
      result.setDate(result.getDate() + 7);
      break;
    case 'monthly':
      result.setMonth(result.getMonth() + 1);
      break;
    default:
      break;
  }

  return result;
}

interface MaintenancePreviewInput {
  scheduleType: MaintenanceScheduleType;
  frequency: MaintenanceFrequency | null;
  mileageIntervalKm: number | null;
  lastCompletedAt: string | null;
  lastCompletedOdometerKm: number | null;
  odometerKm: number;
  carCreatedAt: string;
}

export function computePersonalMaintenancePreview(input: MaintenancePreviewInput): string | null {
  if (input.scheduleType === 'time') {
    if (!input.frequency) {
      return null;
    }

    const anchor = input.lastCompletedAt
      ? new Date(`${input.lastCompletedAt}T12:00:00`)
      : new Date(input.carCreatedAt);
    const nextDueDate = addMaintenanceInterval(anchor, input.frequency);

    return formatExpenseDate(nextDueDate.toISOString());
  }

  if (!input.mileageIntervalKm) {
    return null;
  }

  const baseKm = input.lastCompletedOdometerKm ?? input.odometerKm;
  const nextDueOdometerKm = baseKm + input.mileageIntervalKm;

  return `${nextDueOdometerKm.toLocaleString()} km`;
}
