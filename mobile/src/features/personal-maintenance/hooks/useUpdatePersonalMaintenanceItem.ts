import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carsKeys } from '@/features/cars/hooks/cars.keys';

import { personalMaintenanceService } from '../services/personal-maintenance.service';

export function useUpdatePersonalMaintenanceItem(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: Parameters<typeof personalMaintenanceService.updatePersonalMaintenanceItem>[2];
    }) => personalMaintenanceService.updatePersonalMaintenanceItem(carId, itemId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(carsKeys.detail(carId), data);
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
    },
  });
}
