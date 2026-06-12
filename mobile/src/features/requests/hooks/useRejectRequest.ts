import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { requestsService } from '../services/requests.service';
import { requestsKeys } from './requests.keys';

export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => requestsService.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestsKeys.lists() });
    },
    meta: { getErrorMessage },
  });
}
