import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardKeys } from '@/features/dashboard/hooks/dashboard.keys';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { carsService } from '../services/cars.service';
import type { CreateCarRequest } from '../types/cars.types';
import { carsKeys } from './cars.keys';

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCarRequest) => carsService.createCar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
    meta: { getErrorMessage },
  });
}
