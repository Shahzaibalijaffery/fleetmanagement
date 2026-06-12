import { useQuery } from '@tanstack/react-query';

import { contractsService } from '../services/contracts.service';
import { contractsKeys } from './contracts.keys';

export function useContractByAssignment(assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: contractsKeys.byAssignment(assignmentId),
    queryFn: () => contractsService.getContractByAssignment(assignmentId),
    staleTime: 60 * 1000,
    enabled: enabled && Boolean(assignmentId),
    retry: false,
    throwOnError: false,
  });
}
