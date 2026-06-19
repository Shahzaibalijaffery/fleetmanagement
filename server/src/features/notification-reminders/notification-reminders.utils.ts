import { DateTime } from 'luxon';

import { env } from '../../config/env';

import {
  getExpenseReminderSlotConfigs,
  getExpenseReminderTimesSummary,
  isExpenseReminderSlotActive,
  type ExpenseReminderSlot,
} from './expense-reminder-times.config';

export function getNotificationTimezone(): string {
  return env.NOTIFICATION_TIMEZONE;
}

export function getLocalDayRange(date = new Date(), timeZone = getNotificationTimezone()) {
  const local = DateTime.fromJSDate(date, { zone: timeZone });
  const start = local.startOf('day');
  const end = start.plus({ days: 1 });

  return {
    start: start.toUTC().toJSDate(),
    end: end.toUTC().toJSDate(),
    localDateKey: start.toISODate() ?? '',
  };
}

export function daysSince(date: Date | null | undefined, now = new Date(), timeZone = getNotificationTimezone()): number {
  if (!date) {
    return Number.POSITIVE_INFINITY;
  }

  const start = DateTime.fromJSDate(date, { zone: timeZone }).startOf('day');
  const today = DateTime.fromJSDate(now, { zone: timeZone }).startOf('day');

  return Math.floor(today.diff(start, 'days').days);
}

export function isSameLocalDay(
  left: Date,
  right: Date,
  timeZone = getNotificationTimezone(),
): boolean {
  const leftDay = DateTime.fromJSDate(left, { zone: timeZone }).startOf('day');
  const rightDay = DateTime.fromJSDate(right, { zone: timeZone }).startOf('day');

  return leftDay.toMillis() === rightDay.toMillis();
}

export function daysSinceLastSent(
  lastSentAt: Date | null | undefined,
  now = new Date(),
  timeZone = getNotificationTimezone(),
): number {
  if (!lastSentAt) {
    return Number.POSITIVE_INFINITY;
  }

  const start = DateTime.fromJSDate(lastSentAt, { zone: timeZone }).startOf('day');
  const today = DateTime.fromJSDate(now, { zone: timeZone }).startOf('day');

  return Math.floor(today.diff(start, 'days').days);
}

export function canSendMaintenanceReminder(
  lastSentAt: Date | null | undefined,
  now: Date,
  repeatEveryDays: number,
  timeZone = getNotificationTimezone(),
): boolean {
  if (!lastSentAt) {
    return true;
  }

  if (isSameLocalDay(lastSentAt, now, timeZone)) {
    return false;
  }

  return daysSinceLastSent(lastSentAt, now, timeZone) >= repeatEveryDays;
}

export function getActiveExpenseReminderSlot(
  now = new Date(),
  timeZone = getNotificationTimezone(),
): ExpenseReminderSlot | null {
  const local = DateTime.fromJSDate(now, { zone: timeZone });

  for (const slot of getExpenseReminderSlotConfigs()) {
    if (isExpenseReminderSlotActive(local, slot)) {
      return slot.key;
    }
  }

  return null;
}

export function getExpenseReminderSlotLabels(): string {
  return getExpenseReminderTimesSummary();
}
