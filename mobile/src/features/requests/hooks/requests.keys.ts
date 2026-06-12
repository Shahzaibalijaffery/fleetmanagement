import type { RequestsListFilters } from '../types/requests.types';

export const requestsKeys = {
  all: ['requests'] as const,
  lists: () => [...requestsKeys.all, 'list'] as const,
  list: (filters: RequestsListFilters) => [...requestsKeys.lists(), filters] as const,
  details: () => [...requestsKeys.all, 'detail'] as const,
  detail: (requestId: string) => [...requestsKeys.details(), requestId] as const,
};
