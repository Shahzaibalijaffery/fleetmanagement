import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { dashboardKeys } from '@/features/dashboard/hooks/dashboard.keys';

import { contractsService } from '../services/contracts.service';
import type { CreateContractPayload } from '../types/contracts.types';
import { contractsKeys } from './contracts.keys';

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContractPayload) => contractsService.createContract(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: contractsKeys.byAssignment(variables.assignmentId),
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
    meta: { getErrorMessage },
  });
}
