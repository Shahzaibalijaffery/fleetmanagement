import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carsKeys } from '@/features/cars/hooks/cars.keys';

import { personalMaintenanceService } from '../services/personal-maintenance.service';

export function useCompletePersonalMaintenanceItem(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      cost,
      odometerKm,
    }: {
      itemId: string;
      cost: number;
      odometerKm?: number;
    }) => personalMaintenanceService.completePersonalMaintenanceItem(carId, itemId, { cost, odometerKm }),
    onSuccess: (data) => {
      queryClient.setQueryData(carsKeys.detail(carId), data);
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
