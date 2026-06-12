import type { ContractsListFilters } from '../types/contracts.types';

export const contractsKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractsKeys.all, 'list'] as const,
  list: (filters: ContractsListFilters) => [...contractsKeys.lists(), filters] as const,
  details: () => [...contractsKeys.all, 'detail'] as const,
  detail: (contractId: string) => [...contractsKeys.details(), contractId] as const,
  byAssignment: (assignmentId: string) =>
    [...contractsKeys.all, 'by-assignment', assignmentId] as const,
};
