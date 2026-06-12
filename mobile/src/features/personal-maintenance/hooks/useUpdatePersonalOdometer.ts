import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carsKeys } from '@/features/cars/hooks/cars.keys';
import { carsService } from '@/features/cars/services/cars.service';

export function useUpdatePersonalOdometer(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personalCurrentOdometerKm: number) =>
      carsService.updatePersonalOdometer(carId, { personalCurrentOdometerKm }),
    onSuccess: (data) => {
      queryClient.setQueryData(carsKeys.detail(carId), data);
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
    },
  });
}
