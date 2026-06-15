import { apiClient } from '@/shared/api/client';
import type { ApiResponse, PaginatedResponse } from '@/shared/api/types';

import type { Car, CreateCarRequest, ListCarsParams, UpdateCarRequest } from '../types/cars.types';

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
};

export const CARS_PAGE_LIMIT = PAGE_LIMIT;
