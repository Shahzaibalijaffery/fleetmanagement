import { useMutation, useQueryClient } from '@tanstack/react-query';

import { expensesService } from '../services/expenses.service';
import type { CreateExpenseRequest } from '../types/expenses.types';
import { expensesKeys } from './expenses.keys';

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpenseRequest) => expensesService.createExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
  });
}
