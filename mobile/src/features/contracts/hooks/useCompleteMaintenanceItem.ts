import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { contractsService } from '../services/contracts.service';
import { contractsKeys } from './contracts.keys';

export function useCompleteMaintenanceItem(contractId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      cost,
      currentOdometerKm,
    }: {
      itemId: string;
      cost: number;
      currentOdometerKm?: number;
    }) => contractsService.completeMaintenanceItem(contractId, itemId, cost, currentOdometerKm),
    onSuccess: (data) => {
      queryClient.setQueryData(contractsKeys.detail(contractId), data);
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    meta: { getErrorMessage },
  });
}
