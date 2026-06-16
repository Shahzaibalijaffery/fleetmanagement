import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { pushNotificationsService } from '../services/push-notifications.service';
import type { RemoveDeviceTokenRequest } from '../types/push-notifications.types';

export function useRemoveDeviceToken() {
  return useMutation({
    mutationFn: (payload: RemoveDeviceTokenRequest) =>
      pushNotificationsService.removeDeviceToken(payload),
    meta: { getErrorMessage },
  });
}
