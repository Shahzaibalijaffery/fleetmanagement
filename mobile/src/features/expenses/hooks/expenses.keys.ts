import type { ExpensesListFilters } from '../types/expenses.types';

export const expensesKeys = {
  all: ['expenses'] as const,
  lists: () => [...expensesKeys.all, 'list'] as const,
  list: (filters: ExpensesListFilters) => [...expensesKeys.lists(), filters] as const,
  details: () => [...expensesKeys.all, 'detail'] as const,
  detail: (expenseId: string) => [...expensesKeys.details(), expenseId] as const,
};
