import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { contractsService } from '../services/contracts.service';
import { contractsKeys } from './contracts.keys';

export function useUpdateContractOdometer(contractId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currentOdometerKm: number) =>
      contractsService.updateOdometer(contractId, currentOdometerKm),
    onSuccess: (data) => {
      queryClient.setQueryData(contractsKeys.detail(contractId), data);
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
    },
    meta: { getErrorMessage },
  });
}
