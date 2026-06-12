import { apiClient } from '@/shared/api/client';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';

import type {
  Contract,
  CreateContractPayload,
  ListContractsParams,
  UpdateContractPayload,
} from '../types/contracts.types';

const PAGE_LIMIT = 20;

export const contractsService = {
  listContracts: (params: ListContractsParams) =>
    apiClient
      .get<PaginatedResponse<Contract>>('/contracts', { params })
      .then((r) => r.data),

  getContract: (contractId: string) =>
    apiClient.get<ApiResponse<Contract>>(`/contracts/${contractId}`).then((r) => r.data.data),

  getContractByAssignment: (assignmentId: string) =>
    apiClient
      .get<ApiResponse<Contract | null>>(`/contracts/by-assignment/${assignmentId}`)
      .then((r) => r.data.data),

  createContract: (payload: CreateContractPayload) =>
    apiClient.post<ApiResponse<Contract>>('/contracts', payload).then((r) => r.data.data),

  updateContract: (contractId: string, payload: UpdateContractPayload) =>
    apiClient
      .patch<ApiResponse<Contract>>(`/contracts/${contractId}`, payload)
      .then((r) => r.data.data),

  updateOdometer: (contractId: string, currentOdometerKm: number) =>
    apiClient
      .patch<ApiResponse<Contract>>(`/contracts/${contractId}/odometer`, { currentOdometerKm })
      .then((r) => r.data.data),

  completeMaintenanceItem: (
    contractId: string,
    itemId: string,
    currentOdometerKm?: number,
  ) =>
    apiClient
      .post<ApiResponse<Contract>>(
        `/contracts/${contractId}/maintenance/${itemId}/complete`,
        currentOdometerKm != null ? { currentOdometerKm } : undefined,
      )
      .then((r) => r.data.data),
};

export const CONTRACTS_PAGE_LIMIT = PAGE_LIMIT;
