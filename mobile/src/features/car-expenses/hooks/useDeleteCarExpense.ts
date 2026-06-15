import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carExpensesService } from '../services/car-expenses.service';
import { carExpensesKeys } from './car-expenses.keys';

export function useDeleteCarExpense(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => carExpensesService.deleteExpense(carId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carExpensesKeys.all });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
