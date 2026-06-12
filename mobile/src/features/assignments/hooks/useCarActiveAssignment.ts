import { useQuery } from '@tanstack/react-query';

import { assignmentsService } from '../services/assignments.service';
import { assignmentsKeys } from './assignments.keys';

export function useCarActiveAssignment(carId: string, enabled = true) {
  return useQuery({
    queryKey: assignmentsKeys.activeCar(carId),
    queryFn: () => assignmentsService.getActiveAssignmentForCar(carId),
    staleTime: 60 * 1000,
    enabled: enabled && Boolean(carId),
  });
}
