import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { contractsService } from '../services/contracts.service';
import type { UpdateContractPayload } from '../types/contracts.types';
import { contractsKeys } from './contracts.keys';

interface UpdateContractVariables {
  contractId: string;
  payload: UpdateContractPayload;
}

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, payload }: UpdateContractVariables) =>
      contractsService.updateContract(contractId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractsKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: contractsKeys.byAssignment(data.assignmentId),
      });
    },
    meta: { getErrorMessage },
  });
}
