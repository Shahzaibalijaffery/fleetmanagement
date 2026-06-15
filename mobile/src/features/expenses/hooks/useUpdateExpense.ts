import { useMutation, useQueryClient } from '@tanstack/react-query';

import { expensesService } from '../services/expenses.service';
import type { UpdateExpenseRequest } from '../types/expenses.types';
import { expensesKeys } from './expenses.keys';

export function useUpdateExpense(expenseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateExpenseRequest) =>
      expensesService.updateExpense(expenseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
  });
}
