import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carsKeys } from '@/features/cars/hooks/cars.keys';

import { personalMaintenanceService } from '../services/personal-maintenance.service';

export function useUpdatePersonalMaintenance(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof personalMaintenanceService.updatePersonalMaintenance>[1]) =>
      personalMaintenanceService.updatePersonalMaintenance(carId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(carsKeys.detail(carId), data);
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
    },
  });
}
