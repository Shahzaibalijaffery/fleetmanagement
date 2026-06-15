export type ExpenseSource = 'general' | 'car' | 'running_cost';

export interface ExpenseListItem {
  id: string;
  source: ExpenseSource;
  title: string;
  amount: number;
  expenseDate: string;
  notes?: string;
  carId?: string;
  carLabel?: string;
  logId?: string;
  visitTitle?: string;
  itemCount?: number;
}

export interface Expense {
  id: string;
  ownerId: string;
  title: string;
  amount: number;
  expenseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListExpensesParams {
  page: number;
  limit: number;
  includeCarExpenses: boolean;
  year: number;
  month: number;
}

export interface ListExpensesResponse {
  data: ExpenseListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  totalSpent: number;
  salary: number | null;
  remainingSalary: number | null;
  includeCarExpenses: boolean;
  year: number;
  month: number;
}

export interface SetMonthlySalaryRequest {
  year: number;
  month: number;
  amount: number;
}

export interface MonthlySalary {
  id: string;
  ownerId: string;
  year: number;
  month: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  expenseDate: string;
  notes?: string;
}

export interface UpdateExpenseRequest {
  title?: string;
  amount?: number;
  expenseDate?: string;
  notes?: string;
}

export interface ExpensesListFilters {
  includeCarExpenses: boolean;
  year: number;
  month: number;
}
