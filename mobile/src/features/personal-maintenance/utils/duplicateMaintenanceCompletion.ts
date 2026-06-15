interface DuplicateCompletionItem {
  lastCompletedAt: string | null;
  lastCompletedOdometerKm: number | null;
}

function isSameLocalCalendarDay(left: Date | string, right: Date): boolean {
  const leftDate = typeof left === 'string' ? new Date(left) : left;

  return (
    leftDate.getFullYear() === right.getFullYear() &&
    leftDate.getMonth() === right.getMonth() &&
    leftDate.getDate() === right.getDate()
  );
}

export function isDuplicateMileageCompletion(
  item: DuplicateCompletionItem,
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

export const DUPLICATE_MILEAGE_COMPLETION_MESSAGE =
  'This service was already recorded today at this mileage';
