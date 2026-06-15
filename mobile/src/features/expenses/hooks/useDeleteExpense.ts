import { useMutation, useQueryClient } from '@tanstack/react-query';

import { expensesService } from '../services/expenses.service';
import { expensesKeys } from './expenses.keys';

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => expensesService.deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
  });
}
