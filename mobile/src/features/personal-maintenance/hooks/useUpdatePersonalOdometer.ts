import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carsKeys } from '@/features/cars/hooks/cars.keys';

import { personalMaintenanceService } from '../services/personal-maintenance.service';

function useInvalidateCarDetail(carId: string) {
  const queryClient = useQueryClient();

  return (data: Awaited<ReturnType<typeof personalMaintenanceService.updatePersonalOdometer>>) => {
    queryClient.setQueryData(carsKeys.detail(carId), data);
    queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
  };
}

export function useUpdatePersonalOdometer(carId: string) {
  const invalidateCar = useInvalidateCarDetail(carId);

  return useMutation({
    mutationFn: (personalCurrentOdometerKm: number) =>
      personalMaintenanceService.updatePersonalOdometer(carId, { personalCurrentOdometerKm }),
    onSuccess: invalidateCar,
  });
}
