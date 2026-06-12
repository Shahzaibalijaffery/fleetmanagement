import { useQuery } from '@tanstack/react-query';

import { CAR_EXPENSES_PAGE_LIMIT, carExpensesService } from '../services/car-expenses.service';
import { carExpensesKeys } from './car-expenses.keys';

export function useCarExpenses(carId: string, enabled = true) {
  return useQuery({
    queryKey: carExpensesKeys.list(carId, 1),
    queryFn: () =>
      carExpensesService.listExpenses(carId, { page: 1, limit: CAR_EXPENSES_PAGE_LIMIT }),
    enabled: enabled && Boolean(carId),
    staleTime: 60 * 1000,
  });
}
