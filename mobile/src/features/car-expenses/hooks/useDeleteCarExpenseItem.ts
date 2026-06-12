import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carExpensesService } from '../services/car-expenses.service';
import { carExpensesKeys } from './car-expenses.keys';

export function useDeleteCarExpenseItem(carId: string, logId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => carExpensesService.deleteExpenseItem(carId, logId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carExpensesKeys.all });
    },
  });
}
