export type ExpenseSource = 'general' | 'car' | 'running_cost';

export interface Expense {
  id: string;
  ownerId: string;
  title: string;
  amount: number;
  expenseDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseListItem {
  id: string;
  source: ExpenseSource;
  title: string;
  amount: number;
  expenseDate: Date;
  notes?: string;
  carId?: string;
  carLabel?: string;
  logId?: string;
  visitTitle?: string;
  itemCount?: number;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  expenseDate: string;
  notes?: string;
}

export interface CreateRunningCostExpenseInput {
  carId: string;
  maintenanceItemId: string;
  title: string;
  amount: number;
  expenseDate: string;
}

export interface UpdateExpenseInput {
  title?: string;
  amount?: number;
  expenseDate?: string;
  notes?: string;
}

export interface ListExpensesQuery {
  page: number;
  limit: number;
  includeCarExpenses: boolean;
  year: number;
  month: number;
}

export interface SetMonthlySalaryInput {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlySalaryDocument {
  _id: { toString(): string };
  ownerId: { toString(): string };
  year: number;
  month: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseDocument {
  _id: { toString(): string };
  ownerId: { toString(): string };
  source?: 'general' | 'running_cost';
  title: string;
  amount: number;
  expenseDate: Date;
  notes?: string;
  carId?: { toString(): string } | { _id: { toString(): string }; brand: string; model: string };
  maintenanceItemId?: string;
  createdAt: Date;
  updatedAt: Date;
}
