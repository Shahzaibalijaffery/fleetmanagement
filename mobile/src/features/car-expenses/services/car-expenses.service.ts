import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';

import type {
  AddCarExpenseItemRequest,
  CarExpenseLog,
  CreateCarExpenseRequest,
  ListCarExpensesParams,
  ListCarExpensesResponse,
  UpdateCarExpenseItemRequest,
  UpdateCarExpenseRequest,
} from '../types/car-expenses.types';

const PAGE_LIMIT = 20;

export const carExpensesService = {
  listExpenses: (carId: string, params: ListCarExpensesParams) =>
    apiClient
      .get<ListCarExpensesResponse>(`/cars/${carId}/expenses`, { params })
      .then((r) => r.data),

  createExpense: (carId: string, payload: CreateCarExpenseRequest) =>
    apiClient
      .post<ApiResponse<CarExpenseLog>>(`/cars/${carId}/expenses`, payload)
      .then((r) => r.data.data),

  addExpenseItem: (carId: string, logId: string, payload: AddCarExpenseItemRequest) =>
    apiClient
      .post<ApiResponse<CarExpenseLog>>(`/cars/${carId}/expenses/${logId}/items`, payload)
      .then((r) => r.data.data),

  updateExpense: (carId: string, logId: string, payload: UpdateCarExpenseRequest) =>
    apiClient
      .patch<ApiResponse<CarExpenseLog>>(`/cars/${carId}/expenses/${logId}`, payload)
      .then((r) => r.data.data),

  updateExpenseItem: (
    carId: string,
    logId: string,
    itemId: string,
    payload: UpdateCarExpenseItemRequest,
  ) =>
    apiClient
      .patch<ApiResponse<CarExpenseLog>>(
        `/cars/${carId}/expenses/${logId}/items/${itemId}`,
        payload,
      )
      .then((r) => r.data.data),

  deleteExpenseItem: (carId: string, logId: string, itemId: string) =>
    apiClient
      .delete<ApiResponse<CarExpenseLog>>(`/cars/${carId}/expenses/${logId}/items/${itemId}`)
      .then((r) => (r.status === 204 ? null : (r.data?.data ?? null))),

  deleteExpense: (carId: string, logId: string) =>
    apiClient.delete(`/cars/${carId}/expenses/${logId}`),
};

export const CAR_EXPENSES_PAGE_LIMIT = PAGE_LIMIT;
