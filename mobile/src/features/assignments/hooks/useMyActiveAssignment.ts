import { useQuery } from '@tanstack/react-query';

import { assignmentsService } from '../services/assignments.service';
import { assignmentsKeys } from './assignments.keys';

export function useMyActiveAssignment(enabled = true) {
  return useQuery({
    queryKey: assignmentsKeys.activeMe(),
    queryFn: () => assignmentsService.getMyActiveAssignment(),
    staleTime: 60 * 1000,
    enabled,
  });
}
