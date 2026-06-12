export interface CarExpenseItem {
  id: string;
  title: string;
  amount: number;
}

export interface CarExpenseLog {
  id: string;
  carId: string;
  ownerId: string;
  expenseDate: Date;
  visitTitle?: string;
  items: CarExpenseItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarExpenseItemInput {
  title: string;
  amount: number;
}

export interface CreateCarExpenseLogInput {
  expenseDate: string;
  visitTitle?: string;
  items: CarExpenseItemInput[];
}

export interface UpdateCarExpenseLogInput {
  expenseDate?: string;
  visitTitle?: string;
}

export interface AddCarExpenseItemInput {
  title: string;
  amount: number;
}

export interface UpdateCarExpenseItemInput {
  title?: string;
  amount?: number;
}

export interface ListCarExpensesQuery {
  page: number;
  limit: number;
}

export interface CarExpenseItemDocument {
  _id: { toString(): string };
  title: string;
  amount: number;
}

export interface CarExpenseLogDocument {
  _id: { toString(): string };
  carId: { toString(): string };
  ownerId: { toString(): string };
  expenseDate: Date;
  visitTitle?: string;
  items: CarExpenseItemDocument[];
  createdAt: Date;
  updatedAt: Date;
}
