import type { AssignmentsListFilters } from '../types/assignments.types';

export const assignmentsKeys = {
  all: ['assignments'] as const,
  lists: () => [...assignmentsKeys.all, 'list'] as const,
  list: (filters: AssignmentsListFilters) => [...assignmentsKeys.lists(), filters] as const,
  details: () => [...assignmentsKeys.all, 'detail'] as const,
  detail: (assignmentId: string) => [...assignmentsKeys.details(), assignmentId] as const,
  activeMe: () => [...assignmentsKeys.all, 'active', 'me'] as const,
  activeCar: (carId: string) => [...assignmentsKeys.all, 'active', 'car', carId] as const,
};
