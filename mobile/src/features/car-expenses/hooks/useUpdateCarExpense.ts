import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carExpensesService } from '../services/car-expenses.service';
import type { UpdateCarExpenseRequest } from '../types/car-expenses.types';
import { carExpensesKeys } from './car-expenses.keys';

export function useUpdateCarExpense(carId: string, logId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCarExpenseRequest) =>
      carExpensesService.updateExpense(carId, logId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carExpensesKeys.all });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
