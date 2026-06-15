import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carExpensesService } from '../services/car-expenses.service';
import type { CreateCarExpenseRequest } from '../types/car-expenses.types';
import { carExpensesKeys } from './car-expenses.keys';

export function useCreateCarExpense(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCarExpenseRequest) =>
      carExpensesService.createExpense(carId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carExpensesKeys.all });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
