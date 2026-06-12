import { apiClient } from '@/shared/api/client';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';

import type {
  Car,
  CreateCarRequest,
  ListCarsParams,
  UpdateCarRequest,
  UpdatePersonalMaintenanceRequest,
  UpdatePersonalOdometerRequest,
} from '../types/cars.types';

const PAGE_LIMIT = 20;

export const carsService = {
  listCars: (params: ListCarsParams) =>
    apiClient
      .get<PaginatedResponse<Car>>('/cars', { params })
      .then((r) => r.data),

  getCar: (carId: string) =>
    apiClient.get<ApiResponse<Car>>(`/cars/${carId}`).then((r) => r.data.data),

  createCar: (payload: CreateCarRequest) =>
    apiClient.post<ApiResponse<Car>>('/cars', payload).then((r) => r.data.data),

  updateCar: (carId: string, payload: UpdateCarRequest) =>
    apiClient.patch<ApiResponse<Car>>(`/cars/${carId}`, payload).then((r) => r.data.data),

  deleteCar: (carId: string) => apiClient.delete(`/cars/${carId}`),

  updatePersonalMaintenance: (carId: string, payload: UpdatePersonalMaintenanceRequest) =>
    apiClient
      .patch<ApiResponse<Car>>(`/cars/${carId}/personal-maintenance`, payload)
      .then((r) => r.data.data),

  updatePersonalOdometer: (carId: string, payload: UpdatePersonalOdometerRequest) =>
    apiClient
      .patch<ApiResponse<Car>>(`/cars/${carId}/personal-maintenance/odometer`, payload)
      .then((r) => r.data.data),

  completePersonalMaintenanceItem: (
    carId: string,
    itemId: string,
    personalCurrentOdometerKm?: number,
  ) =>
    apiClient
      .post<ApiResponse<Car>>(`/cars/${carId}/personal-maintenance/${itemId}/complete`, {
        personalCurrentOdometerKm,
      })
      .then((r) => r.data.data),
};

export const CARS_PAGE_LIMIT = PAGE_LIMIT;
