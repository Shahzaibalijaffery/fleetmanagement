import type { ExpenseListItem } from '../types/expenses.types';

export const SMALL_EXPENSE_GROUP_THRESHOLD = 1000;

export type ExpenseListRow =
  | { type: 'single'; expense: ExpenseListItem }
  | { type: 'small-group'; expenses: ExpenseListItem[]; sortDate: string };

function compareByExpenseDate(left: ExpenseListItem, right: ExpenseListItem): number {
  const dateDiff = right.expenseDate.localeCompare(left.expenseDate);

  if (dateDiff !== 0) {
    return dateDiff;
  }

  return right.id.localeCompare(left.id);
}

function getLatestExpenseDate(expenses: ExpenseListItem[]): string {
  return expenses.reduce(
    (latest, expense) => (expense.expenseDate > latest ? expense.expenseDate : latest),
    expenses[0].expenseDate,
  );
}

export function groupSmallExpenses(expenses: ExpenseListItem[]): ExpenseListRow[] {
  const large: ExpenseListItem[] = [];
  const small: ExpenseListItem[] = [];

  for (const expense of expenses) {
    if (expense.amount < SMALL_EXPENSE_GROUP_THRESHOLD) {
      small.push(expense);
    } else {
      large.push(expense);
    }
  }

  const rows: ExpenseListRow[] = large.map((expense) => ({
    type: 'single',
    expense,
  }));

  if (small.length > 0) {
    rows.push({
      type: 'small-group',
      expenses: [...small].sort(compareByExpenseDate),
      sortDate: getLatestExpenseDate(small),
    });
  }

  return rows.sort((left, right) => {
    const leftDate = left.type === 'single' ? left.expense.expenseDate : left.sortDate;
    const rightDate = right.type === 'single' ? right.expense.expenseDate : right.sortDate;

    return rightDate.localeCompare(leftDate);
  });
}

export function getExpenseListRowKey(row: ExpenseListRow): string {
  if (row.type === 'single') {
    return `${row.expense.source}-${row.expense.id}`;
  }

  return 'small-expenses-group';
}

export function getSmallGroupTotal(expenses: ExpenseListItem[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}
