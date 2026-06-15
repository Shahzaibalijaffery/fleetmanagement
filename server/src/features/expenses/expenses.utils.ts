export interface ExpenseMonth {
  year: number;
  month: number;
}

export function getCurrentExpenseMonth(): ExpenseMonth {
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

export function getMonthDateRange({ year, month }: ExpenseMonth) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return { start, end };
}

export function parseExpenseMonth(query: {
  year?: string;
  month?: string;
}): ExpenseMonth {
  const current = getCurrentExpenseMonth();
  const year = query.year ? Number(query.year) : current.year;
  const month = query.month ? Number(query.month) : current.month;

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error('Invalid year');
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Invalid month');
  }

  return { year, month };
}
