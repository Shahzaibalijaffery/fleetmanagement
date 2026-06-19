export function logNotification(message: string, details?: Record<string, unknown>) {
  if (details) {
    console.log(`[notifications] ${message}`, details);
    return;
  }

  console.log(`[notifications] ${message}`);
}

export function logNotificationSkip(
  category: 'expense' | 'maintenance' | 'push',
  reason: string,
  details?: Record<string, unknown>,
) {
  logNotification(`skip ${category} — ${reason}`, details);
}

export function logNotificationSent(
  category: 'expense' | 'maintenance' | 'push',
  details: Record<string, unknown>,
) {
  logNotification(`sent ${category}`, details);
}
