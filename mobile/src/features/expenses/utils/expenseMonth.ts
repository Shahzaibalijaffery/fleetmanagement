export interface ExpenseMonth {
  year: number;
  month: number;
}

export function getCurrentExpenseMonth(): ExpenseMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function formatExpenseMonth({ year, month }: ExpenseMonth): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-PK', {
    month: 'long',
    year: 'numeric',
  });
}

export function getPreviousMonth({ year, month }: ExpenseMonth): ExpenseMonth {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }

  return { year, month: month - 1 };
}

export function getNextMonth({ year, month }: ExpenseMonth): ExpenseMonth {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }

  return { year, month: month + 1 };
}

export function isSameExpenseMonth(left: ExpenseMonth, right: ExpenseMonth): boolean {
  return left.year === right.year && left.month === right.month;
}

export function isFutureExpenseMonth({ year, month }: ExpenseMonth): boolean {
  const current = getCurrentExpenseMonth();

  if (year > current.year) {
    return true;
  }

  return year === current.year && month > current.month;
}

export function expenseMonthKey({ year, month }: ExpenseMonth): string {
  return `${year}-${month}`;
}

export function getSelectableMonths(maxMonths = 24): ExpenseMonth[] {
  const months: ExpenseMonth[] = [];
  let current = getCurrentExpenseMonth();

  for (let index = 0; index < maxMonths; index += 1) {
    months.push(current);
    current = getPreviousMonth(current);
  }

  return months;
}
