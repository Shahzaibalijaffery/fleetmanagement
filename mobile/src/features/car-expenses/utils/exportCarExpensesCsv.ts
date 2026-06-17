import { buildCsv, formatCsvDate } from '@/shared/utils/csv';

import type { CarExpenseLog } from '../types/car-expenses.types';

export function buildCarExpensesCsv(logs: CarExpenseLog[], carLabel: string): string {
  const rows = logs.flatMap((log) =>
    log.items.map((item) => [
      formatCsvDate(log.expenseDate),
      carLabel,
      log.visitTitle ?? '',
      item.title,
      item.amount,
      log.totalAmount,
    ]),
  );

  return buildCsv(
    ['date', 'car', 'visit_title', 'item_title', 'amount', 'visit_total'],
    rows,
  );
}
