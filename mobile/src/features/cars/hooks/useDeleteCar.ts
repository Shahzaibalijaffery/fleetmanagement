import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardKeys } from '@/features/dashboard/hooks/dashboard.keys';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { carsService } from '../services/cars.service';
import { carsKeys } from './cars.keys';

export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId: string) => carsService.deleteCar(carId),
    onSuccess: (_data, carId) => {
      queryClient.removeQueries({ queryKey: carsKeys.detail(carId) });
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
    meta: { getErrorMessage },
  });
}
