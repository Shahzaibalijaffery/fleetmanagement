import { DateTime } from 'luxon';

import { env } from '../../config/env';

const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;

export type ExpenseReminderSlot = string;

export interface ExpenseReminderSlotConfig {
  key: ExpenseReminderSlot;
  hour: number;
  minute: number;
  label: string;
}

function buildSlotKey(hour: number, minute: number): ExpenseReminderSlot {
  return `${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`;
}

function formatSlotLabel(hour: number, minute: number): string {
  return DateTime.fromObject({ hour, minute }).toFormat('h:mm a');
}

function parseTimeToken(token: string): { hour: number; minute: number } {
  const trimmed = token.trim();
  const match = TIME_PATTERN.exec(trimmed);

  if (!match) {
    throw new Error(`Invalid expense reminder time "${token}". Use HH:mm format (e.g. 13:00).`);
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour > 23 || minute > 59) {
    throw new Error(`Invalid expense reminder time "${token}". Hour must be 0-23 and minute 0-59.`);
  }

  return { hour, minute };
}

function parseExpenseReminderTimes(value: string): ExpenseReminderSlotConfig[] {
  const tokens = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    throw new Error('EXPENSE_REMINDER_TIMES must include at least one time.');
  }

  const configs = tokens.map((token) => {
    const { hour, minute } = parseTimeToken(token);

    return {
      key: buildSlotKey(hour, minute),
      hour,
      minute,
      label: formatSlotLabel(hour, minute),
    };
  });

  const uniqueKeys = new Set(configs.map((entry) => entry.key));

  if (uniqueKeys.size !== configs.length) {
    throw new Error('EXPENSE_REMINDER_TIMES contains duplicate times.');
  }

  return configs.sort((left, right) => {
    if (left.hour !== right.hour) {
      return left.hour - right.hour;
    }

    return left.minute - right.minute;
  });
}

const expenseReminderSlotConfigs = parseExpenseReminderTimes(env.EXPENSE_REMINDER_TIMES);

export function getExpenseReminderSlotConfigs(): ExpenseReminderSlotConfig[] {
  return expenseReminderSlotConfigs;
}

export function getExpenseReminderSlotConfig(slot: ExpenseReminderSlot): ExpenseReminderSlotConfig {
  const config = expenseReminderSlotConfigs.find((entry) => entry.key === slot);

  if (!config) {
    throw new Error(`Unknown expense reminder slot: ${slot}`);
  }

  return config;
}

export function isValidExpenseReminderSlot(value: unknown): value is ExpenseReminderSlot {
  return typeof value === 'string' && expenseReminderSlotConfigs.some((entry) => entry.key === value);
}

export function isExpenseReminderSlotActive(
  local: DateTime,
  slot: ExpenseReminderSlotConfig,
): boolean {
  if (slot.minute === 0) {
    return local.hour === slot.hour;
  }

  const scheduled = local.startOf('day').set({
    hour: slot.hour,
    minute: slot.minute,
    second: 0,
    millisecond: 0,
  });
  const diffMinutes = local.diff(scheduled, 'minutes').minutes;

  return diffMinutes >= 0 && diffMinutes < env.NOTIFICATION_SLOT_GRACE_MINUTES;
}

export function getExpenseReminderTimesSummary(): string {
  return expenseReminderSlotConfigs.map((entry) => entry.label).join(', ');
}
