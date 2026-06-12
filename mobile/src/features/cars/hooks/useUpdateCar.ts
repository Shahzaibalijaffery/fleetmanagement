import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardKeys } from '@/features/dashboard/hooks/dashboard.keys';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { carsService } from '../services/cars.service';
import type { UpdateCarRequest } from '../types/cars.types';
import { carsKeys } from './cars.keys';

interface UpdateCarVariables {
  carId: string;
  payload: UpdateCarRequest;
}

export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ carId, payload }: UpdateCarVariables) =>
      carsService.updateCar(carId, payload),
    onSuccess: (car) => {
      queryClient.setQueryData(carsKeys.detail(car.id), car);
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
    meta: { getErrorMessage },
  });
}
