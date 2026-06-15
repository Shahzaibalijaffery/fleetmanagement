import { useQuery } from '@tanstack/react-query';

import { expensesService } from '../services/expenses.service';
import { expensesKeys } from './expenses.keys';

export function useExpense(expenseId: string) {
  return useQuery({
    queryKey: expensesKeys.detail(expenseId),
    queryFn: () => expensesService.getExpense(expenseId),
    staleTime: 60 * 1000,
  });
}
