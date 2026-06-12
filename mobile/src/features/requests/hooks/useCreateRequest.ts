import { useMutation, useQueryClient } from '@tanstack/react-query';

import { assignmentsKeys } from '@/features/assignments/hooks/assignments.keys';
import { marketplaceKeys } from '@/features/marketplace/hooks/marketplace.keys';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { requestsService } from '../services/requests.service';
import type { CreateRequestPayload } from '../types/requests.types';
import { requestsKeys } from './requests.keys';

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => requestsService.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.cars() });
      queryClient.invalidateQueries({ queryKey: assignmentsKeys.activeMe() });
    },
    meta: { getErrorMessage },
  });
}
