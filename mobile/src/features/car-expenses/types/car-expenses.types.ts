export interface CarExpenseItem {
  id: string;
  title: string;
  amount: number;
}

export interface CarExpenseLog {
  id: string;
  carId: string;
  ownerId: string;
  expenseDate: string;
  visitTitle?: string;
  items: CarExpenseItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CarExpenseItemInput {
  title: string;
  amount: number;
}

export interface CreateCarExpenseRequest {
  expenseDate: string;
  visitTitle?: string;
  items: CarExpenseItemInput[];
}

export interface AddCarExpenseItemRequest {
  title: string;
  amount: number;
}

export interface UpdateCarExpenseRequest {
  expenseDate?: string;
  visitTitle?: string;
}

export interface UpdateCarExpenseItemRequest {
  title?: string;
  amount?: number;
}

export interface ListCarExpensesParams {
  page: number;
  limit: number;
}

export interface ListCarExpensesResponse {
  data: CarExpenseLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  totalSpent: number;
}
