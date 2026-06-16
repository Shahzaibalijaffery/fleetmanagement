import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { pushNotificationsService } from '../services/push-notifications.service';
import type { RegisterDeviceTokenRequest } from '../types/push-notifications.types';

export function useRegisterDeviceToken() {
  return useMutation({
    mutationFn: (payload: RegisterDeviceTokenRequest) =>
      pushNotificationsService.registerDeviceToken(payload),
    meta: { getErrorMessage },
  });
}
