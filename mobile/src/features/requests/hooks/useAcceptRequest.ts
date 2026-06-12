import { useMutation, useQueryClient } from '@tanstack/react-query';

import { assignmentsKeys } from '@/features/assignments/hooks/assignments.keys';
import { contractsKeys } from '@/features/contracts/hooks/contracts.keys';
import { dashboardKeys } from '@/features/dashboard/hooks/dashboard.keys';
import { carsKeys } from '@/features/cars/hooks/cars.keys';
import { marketplaceKeys } from '@/features/marketplace/hooks/marketplace.keys';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { requestsService } from '../services/requests.service';
import { requestsKeys } from './requests.keys';

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => requestsService.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentsKeys.all });
      queryClient.invalidateQueries({ queryKey: contractsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
      queryClient.invalidateQueries({ queryKey: carsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: carsKeys.details() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.cars() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.drivers() });
    },
    meta: { getErrorMessage },
  });
}
