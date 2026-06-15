import axios from 'axios';

import type { ApiErrorBody } from '@/shared/api/types';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return 'Cannot reach the server. Check that the API is running and APP_ENV is set correctly.';
    }

    return error.response.data?.error?.message ?? 'Something went wrong';
  }

  return 'Something went wrong';
}
