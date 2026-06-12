import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carsKeys } from '@/features/cars/hooks/cars.keys';
import { carsService } from '@/features/cars/services/cars.service';

export function useCompletePersonalMaintenanceItem(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      personalCurrentOdometerKm,
    }: {
      itemId: string;
      personalCurrentOdometerKm?: number;
    }) => carsService.completePersonalMaintenanceItem(carId, itemId, personalCurrentOdometerKm),
    onSuccess: (data) => {
      queryClient.setQueryData(carsKeys.detail(carId), data);
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
    },
  });
}
