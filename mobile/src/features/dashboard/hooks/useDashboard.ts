import { useQuery } from '@tanstack/react-query';

import { dashboardService } from '../services/dashboard.service';
import { dashboardKeys } from './dashboard.keys';

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardService.getDashboard(),
    staleTime: 60 * 1000,
  });
}
