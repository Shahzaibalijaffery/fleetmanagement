import { addMaintenanceInterval } from '../contracts/maintenanceChecklist.utils';
import type { MaintenanceFrequency } from '../contracts/contracts.types';

import type {
  CarDocument,
  PersonalMaintenanceChecklistItem,
  PersonalMaintenanceChecklistItemView,
} from './cars.types';

function resolveTimeItemStatus(
  car: CarDocument,
  item: PersonalMaintenanceChecklistItem,
  now: Date,
): Pick<PersonalMaintenanceChecklistItemView, 'status' | 'nextDueDate' | 'nextDueOdometerKm'> {
  if (!item.frequency) {
    return {
      status: 'upcoming',
      nextDueDate: null,
      nextDueOdometerKm: null,
    };
  }

  const anchor = item.lastCompletedAt
    ? new Date(item.lastCompletedAt)
    : new Date(car.createdAt);
  const nextDueDate = addMaintenanceInterval(anchor, item.frequency as MaintenanceFrequency);

  if (now > nextDueDate) {
    return { status: 'overdue', nextDueDate, nextDueOdometerKm: null };
  }

  if (now.toDateString() === nextDueDate.toDateString()) {
    return { status: 'due', nextDueDate, nextDueOdometerKm: null };
  }

  return { status: 'upcoming', nextDueDate, nextDueOdometerKm: null };
}

function resolveMileageItemStatus(
  car: CarDocument,
  item: PersonalMaintenanceChecklistItem,
): Pick<PersonalMaintenanceChecklistItemView, 'status' | 'nextDueDate' | 'nextDueOdometerKm'> {
  if (item.mileageIntervalKm == null) {
    return {
      status: 'upcoming',
      nextDueDate: null,
      nextDueOdometerKm: null,
    };
  }

  const initialKm = car.personalInitialOdometerKm ?? 0;
  const currentKm = car.personalCurrentOdometerKm ?? initialKm;
  const baseKm = item.lastCompletedOdometerKm ?? initialKm;
  const nextDueOdometerKm = baseKm + item.mileageIntervalKm;

  if (currentKm >= nextDueOdometerKm) {
    return { status: 'overdue', nextDueDate: null, nextDueOdometerKm };
  }

  const remainingKm = nextDueOdometerKm - currentKm;
  const dueSoonThreshold = Math.min(500, item.mileageIntervalKm * 0.1);

  if (remainingKm <= dueSoonThreshold) {
    return { status: 'due', nextDueDate: null, nextDueOdometerKm };
  }

  return { status: 'upcoming', nextDueDate: null, nextDueOdometerKm };
}

export function enrichPersonalMaintenanceItem(
  car: CarDocument,
  item: PersonalMaintenanceChecklistItem,
  now = new Date(),
): PersonalMaintenanceChecklistItemView {
  const resolved =
    item.scheduleType === 'time'
      ? resolveTimeItemStatus(car, item, now)
      : resolveMileageItemStatus(car, item);

  return {
    id: item._id.toString(),
    title: item.title,
    scheduleType: item.scheduleType,
    frequency: item.frequency ?? null,
    mileageIntervalKm: item.mileageIntervalKm ?? null,
    lastCompletedAt: item.lastCompletedAt ?? null,
    lastCompletedOdometerKm: item.lastCompletedOdometerKm ?? null,
    ...resolved,
  };
}

export function enrichPersonalMaintenanceChecklist(
  car: CarDocument,
  now = new Date(),
): PersonalMaintenanceChecklistItemView[] {
  return (car.personalMaintenanceChecklist ?? []).map((item) =>
    enrichPersonalMaintenanceItem(car, item, now),
  );
}

export function hasMileagePersonalItems(items: { scheduleType: string }[]): boolean {
  return items.some((item) => item.scheduleType === 'mileage');
}

export const DEFAULT_PERSONAL_MAINTENANCE_PRESETS = [
  { title: 'Washing', scheduleType: 'time' as const, frequency: 'weekly' as const },
  { title: 'General service', scheduleType: 'time' as const, frequency: 'monthly' as const },
  { title: 'Oil change', scheduleType: 'mileage' as const, mileageIntervalKm: 5000 },
];
