import { useMutation, useQueryClient } from '@tanstack/react-query';

import { expensesService } from '../services/expenses.service';
import type { SetMonthlySalaryRequest } from '../types/expenses.types';
import { expensesKeys } from './expenses.keys';

export function useSetMonthlySalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SetMonthlySalaryRequest) => expensesService.setMonthlySalary(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
  });
}
