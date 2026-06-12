import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carExpensesService } from '../services/car-expenses.service';
import type { UpdateCarExpenseItemRequest } from '../types/car-expenses.types';
import { carExpensesKeys } from './car-expenses.keys';

export function useUpdateCarExpenseItem(carId: string, logId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: UpdateCarExpenseItemRequest;
    }) => carExpensesService.updateExpenseItem(carId, logId, itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carExpensesKeys.all });
    },
  });
}
