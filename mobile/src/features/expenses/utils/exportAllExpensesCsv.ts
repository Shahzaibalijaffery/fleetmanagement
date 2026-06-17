import { buildCsv, formatCsvDate } from '@/shared/utils/csv';

import type { ExpenseListItem, ExpenseSource } from '../types/expenses.types';

function formatSource(source: ExpenseSource): string {
  switch (source) {
    case 'running_cost':
      return 'Running cost';
    case 'car':
      return 'Car repair';
    default:
      return 'General';
  }
}

export function buildAllExpensesCsv(
  expenses: ExpenseListItem[],
  monthLabel: string,
  role: 'owner' | 'driver',
): string {
  const rows = expenses.map((expense) => [
    formatCsvDate(expense.expenseDate),
    formatSource(expense.source),
    expense.title,
    expense.amount,
    expense.carLabel ?? '',
    expense.notes ?? '',
    monthLabel,
    role,
  ]);

  return buildCsv(
    ['date', 'type', 'title', 'amount', 'car', 'notes', 'month', 'account_role'],
    rows,
  );
}
