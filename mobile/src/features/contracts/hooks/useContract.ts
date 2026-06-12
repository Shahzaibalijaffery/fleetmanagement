import { useQuery } from '@tanstack/react-query';

import { contractsService } from '../services/contracts.service';
import { contractsKeys } from './contracts.keys';

export function useContract(contractId: string) {
  return useQuery({
    queryKey: contractsKeys.detail(contractId),
    queryFn: () => contractsService.getContract(contractId),
    staleTime: 60 * 1000,
    enabled: Boolean(contractId),
  });
}
