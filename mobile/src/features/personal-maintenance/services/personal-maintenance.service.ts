import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';

import type { Car, UpdatePersonalMaintenanceItemRequest, UpdatePersonalMaintenanceRequest, UpdatePersonalOdometerRequest } from '@/features/cars/types/cars.types';

export const personalMaintenanceService = {
  updatePersonalMaintenance: (carId: string, payload: UpdatePersonalMaintenanceRequest) =>
    apiClient
      .patch<ApiResponse<Car>>(`/cars/${carId}/personal-maintenance`, payload)
      .then((r) => r.data.data),

  updatePersonalOdometer: (carId: string, payload: UpdatePersonalOdometerRequest) =>
    apiClient
      .patch<ApiResponse<Car>>(`/cars/${carId}/personal-maintenance/odometer`, payload)
      .then((r) => r.data.data),

  updatePersonalMaintenanceItem: (
    carId: string,
    itemId: string,
    payload: UpdatePersonalMaintenanceItemRequest,
  ) =>
    apiClient
      .patch<ApiResponse<Car>>(`/cars/${carId}/personal-maintenance/${itemId}`, payload)
      .then((r) => r.data.data),

  completePersonalMaintenanceItem: (
    carId: string,
    itemId: string,
    payload: { cost: number; odometerKm?: number },
  ) =>
    apiClient
      .post<ApiResponse<Car>>(`/cars/${carId}/personal-maintenance/${itemId}/complete`, {
        cost: payload.cost,
        personalCurrentOdometerKm: payload.odometerKm,
      })
      .then((r) => r.data.data),
};
