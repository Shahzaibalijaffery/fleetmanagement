import { DateTime } from 'luxon';

import { env } from '../../config/env';

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

export function daysSinceLastSent(lastSentAt: Date | null | undefined, now = new Date()): number {
  if (!lastSentAt) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.floor(DateTime.fromJSDate(now).diff(DateTime.fromJSDate(lastSentAt), 'days').days);
}
