import axios from 'axios';

import type { ApiErrorBody } from '@/shared/api/types';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
}
