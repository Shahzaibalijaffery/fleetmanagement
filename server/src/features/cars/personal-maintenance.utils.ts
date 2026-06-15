import { addMaintenanceInterval } from '../contracts/maintenanceChecklist.utils';
import type { MaintenanceFrequency } from '../contracts/contracts.types';

import type {
  CarDocument,
  PersonalMaintenanceChecklistItem,
  PersonalMaintenanceChecklistItemView,
} from './cars.types';

export function parseMaintenanceDate(value: Date | string): Date {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.slice(0, 10))) {
    return new Date(`${value.slice(0, 10)}T12:00:00`);
  }

  return new Date(value);
}

function startOfLocalDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

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
    ? parseMaintenanceDate(item.lastCompletedAt)
    : new Date(car.createdAt);
  const nextDueDate = addMaintenanceInterval(anchor, item.frequency as MaintenanceFrequency);
  const today = startOfLocalDay(now);
  const dueDay = startOfLocalDay(nextDueDate);

  if (today > dueDay) {
    return { status: 'overdue', nextDueDate, nextDueOdometerKm: null };
  }

  if (today.getTime() === dueDay.getTime()) {
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

  const currentKm = car.personalCurrentOdometerKm ?? 0;
  const baseKm = item.lastCompletedOdometerKm ?? currentKm;
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

export const DEFAULT_PERSONAL_MAINTENANCE_PRESETS = [
  { title: 'Washing', scheduleType: 'time' as const, frequency: 'weekly' as const },
  { title: 'General service', scheduleType: 'time' as const, frequency: 'monthly' as const },
  { title: 'Oil change', scheduleType: 'mileage' as const, mileageIntervalKm: 5000 },
];

export const DUPLICATE_MILEAGE_COMPLETION_MESSAGE =
  'This service was already recorded today at this mileage';

function isSameLocalCalendarDay(left: Date | string, right: Date): boolean {
  const leftDate = typeof left === 'string' ? new Date(left) : left;

  return (
    leftDate.getFullYear() === right.getFullYear() &&
    leftDate.getMonth() === right.getMonth() &&
    leftDate.getDate() === right.getDate()
  );
}

export function isDuplicateMileageCompletion(
  item: Pick<PersonalMaintenanceChecklistItem, 'lastCompletedAt' | 'lastCompletedOdometerKm'>,
  odometerKm: number,
  completedAt = new Date(),
): boolean {
  if (!item.lastCompletedAt || item.lastCompletedOdometerKm == null) {
    return false;
  }

  return (
    isSameLocalCalendarDay(item.lastCompletedAt, completedAt) &&
    item.lastCompletedOdometerKm === odometerKm
  );
}
