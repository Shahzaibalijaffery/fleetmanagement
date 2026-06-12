import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carsKeys } from '@/features/cars/hooks/cars.keys';
import { carsService } from '@/features/cars/services/cars.service';
import type { UpdatePersonalMaintenanceRequest } from '@/features/cars/types/cars.types';

export function useUpdatePersonalMaintenance(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePersonalMaintenanceRequest) =>
      carsService.updatePersonalMaintenance(carId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(carsKeys.detail(carId), data);
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
    },
  });
}
