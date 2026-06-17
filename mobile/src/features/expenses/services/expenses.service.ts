import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';
import { fetchAllPages } from '@/shared/utils/fetchAllPages';

import type {
  CreateExpenseRequest,
  Expense,
  ListExpensesParams,
  ListExpensesResponse,
  MonthlySalary,
  SetMonthlySalaryRequest,
  UpdateExpenseRequest,
} from '../types/expenses.types';

const PAGE_LIMIT = 20;
const EXPORT_PAGE_LIMIT = 100;

export const expensesService = {
  listExpenses: (params: ListExpensesParams) =>
    apiClient
      .get<ListExpensesResponse>('/expenses', {
        params: {
          page: params.page,
          limit: params.limit,
          includeCarExpenses: params.includeCarExpenses,
          year: params.year,
          month: params.month,
        },
      })
      .then((response) => response.data),

  fetchAllExpensesForMonth: (params: Omit<ListExpensesParams, 'page' | 'limit'>) =>
    fetchAllPages((page) =>
      expensesService.listExpenses({
        ...params,
        page,
        limit: EXPORT_PAGE_LIMIT,
      }),
    ),

  setMonthlySalary: (payload: SetMonthlySalaryRequest) =>
    apiClient.put<ApiResponse<MonthlySalary>>('/expenses/salary', payload).then((response) => response.data.data),

  getExpense: (expenseId: string) =>
    apiClient.get<ApiResponse<Expense>>(`/expenses/${expenseId}`).then((response) => response.data.data),

  createExpense: (payload: CreateExpenseRequest) =>
    apiClient.post<ApiResponse<Expense>>('/expenses', payload).then((response) => response.data.data),

  updateExpense: (expenseId: string, payload: UpdateExpenseRequest) =>
    apiClient
      .patch<ApiResponse<Expense>>(`/expenses/${expenseId}`, payload)
      .then((response) => response.data.data),

  deleteExpense: (expenseId: string) => apiClient.delete(`/expenses/${expenseId}`),
};

export const EXPENSES_PAGE_LIMIT = PAGE_LIMIT;
