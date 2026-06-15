import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/AppError';
import { buildMeta } from '../../shared/types/pagination.types';
import { carExpensesRepository } from '../car-expenses/car-expenses.repository';
import type { CarExpenseLogDocument } from '../car-expenses/car-expenses.types';

import { monthlySalaryRepository } from './monthly-salary.repository';
import { expensesRepository } from './expenses.repository';
import type {
  CreateExpenseInput,
  CreateRunningCostExpenseInput,
  Expense,
  ExpenseDocument,
  ExpenseListItem,
  ListExpensesQuery,
  MonthlySalary,
  MonthlySalaryDocument,
  SetMonthlySalaryInput,
  UpdateExpenseInput,
} from './expenses.types';
import { getMonthDateRange } from './expenses.utils';

interface PopulatedCar {
  _id: { toString(): string };
  brand: string;
  model: string;
  registrationNumber: string;
}

type CarExpenseLogWithCar = CarExpenseLogDocument & {
  carId: PopulatedCar | { toString(): string };
};

function sumItems(items: { amount: number }[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

function toExpense(expense: ExpenseDocument): Expense {
  return {
    id: expense._id.toString(),
    ownerId: expense.ownerId.toString(),
    title: expense.title,
    amount: expense.amount,
    expenseDate: expense.expenseDate,
    notes: expense.notes,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  };
}

function toGeneralListItem(expense: ExpenseDocument): ExpenseListItem {
  return {
    id: expense._id.toString(),
    source: 'general',
    title: expense.title,
    amount: expense.amount,
    expenseDate: expense.expenseDate,
    notes: expense.notes,
  };
}

function toRunningCostListItem(expense: ExpenseDocument): ExpenseListItem {
  const carId =
    expense.carId && typeof expense.carId === 'object' && '_id' in expense.carId
      ? expense.carId._id.toString()
      : expense.carId?.toString();

  return {
    id: expense._id.toString(),
    source: 'running_cost',
    title: expense.title,
    amount: expense.amount,
    expenseDate: expense.expenseDate,
    carId,
    carLabel: carId ? getCarLabel(expense.carId as PopulatedCar | { toString(): string }) : undefined,
  };
}

function toExpenseListItem(expense: ExpenseDocument): ExpenseListItem {
  if (expense.source === 'running_cost') {
    return toRunningCostListItem(expense);
  }

  return toGeneralListItem(expense);
}

function getCarLabel(car: PopulatedCar | { toString(): string }): string {
  if (typeof car === 'object' && 'brand' in car) {
    return `${car.brand} ${car.model}`;
  }

  return 'Car expense';
}

function toCarListItem(log: CarExpenseLogWithCar): ExpenseListItem {
  const items = log.items.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    amount: item.amount,
  }));

  return {
    id: log._id.toString(),
    source: 'car',
    title: log.visitTitle?.trim() || 'Car repair / purchase',
    amount: sumItems(items),
    expenseDate: log.expenseDate,
    carId:
      typeof log.carId === 'object' && 'brand' in log.carId
        ? log.carId._id.toString()
        : log.carId.toString(),
    carLabel: getCarLabel(log.carId),
    logId: log._id.toString(),
    visitTitle: log.visitTitle,
    itemCount: items.length,
  };
}

function sortByExpenseDate(items: ExpenseListItem[]): ExpenseListItem[] {
  return [...items].sort((left, right) => {
    const dateDiff = right.expenseDate.getTime() - left.expenseDate.getTime();

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return right.id.localeCompare(left.id);
  });
}

async function getOwnedExpense(ownerId: string, expenseId: string) {
  const expense = await expensesRepository.findById(expenseId);

  if (!expense) {
    throw new NotFoundError('Expense not found');
  }

  if (expense.ownerId.toString() !== ownerId) {
    throw new ForbiddenError('Access denied');
  }

  return expense as ExpenseDocument;
}

function toMonthlySalary(record: MonthlySalaryDocument): MonthlySalary {
  return {
    id: record._id.toString(),
    ownerId: record.ownerId.toString(),
    year: record.year,
    month: record.month,
    amount: record.amount,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const expensesService = {
  async listExpenses(ownerId: string, query: ListExpensesQuery) {
    const { start, end } = getMonthDateRange({ year: query.year, month: query.month });

    const [generalExpenses, carLogs, generalTotalResult, carTotalResult, salaryRecord] =
      await Promise.all([
      expensesRepository.findByOwnerIdInRange(ownerId, start, end),
      query.includeCarExpenses
        ? carExpensesRepository.findByOwnerIdInRange(ownerId, start, end)
        : [],
      expensesRepository.sumTotalByOwnerIdInRange(ownerId, start, end),
      query.includeCarExpenses
        ? carExpensesRepository.sumTotalByOwnerIdInRange(ownerId, start, end)
        : Promise.resolve([]),
      monthlySalaryRepository.findByOwnerAndMonth(ownerId, query.year, query.month),
    ]);

    const expenseItems = generalExpenses.map((expense) =>
      toExpenseListItem(expense as ExpenseDocument),
    );
    const carItems = query.includeCarExpenses
      ? carLogs.map((log) => toCarListItem(log as CarExpenseLogWithCar))
      : [];

    const merged = sortByExpenseDate([...expenseItems, ...carItems]);
    const skip = (query.page - 1) * query.limit;
    const data = merged.slice(skip, skip + query.limit);
    const generalTotal = generalTotalResult[0]?.total ?? 0;
    const carTotal = carTotalResult[0]?.total ?? 0;
    const totalSpent = generalTotal + (query.includeCarExpenses ? carTotal : 0);
    const salary = salaryRecord?.amount ?? null;
    const remainingSalary = salary === null ? null : salary - totalSpent;

    return {
      data,
      meta: buildMeta(query.page, query.limit, merged.length),
      totalSpent,
      salary,
      remainingSalary,
      includeCarExpenses: query.includeCarExpenses,
      year: query.year,
      month: query.month,
    };
  },

  async setMonthlySalary(ownerId: string, input: SetMonthlySalaryInput) {
    const record = await monthlySalaryRepository.upsert(
      ownerId,
      input.year,
      input.month,
      input.amount,
    );

    if (!record) {
      throw new NotFoundError('Salary not found');
    }

    return toMonthlySalary(record as MonthlySalaryDocument);
  },

  async getExpense(ownerId: string, expenseId: string) {
    const expense = await getOwnedExpense(ownerId, expenseId);
    return toExpense(expense);
  },

  async createExpense(ownerId: string, input: CreateExpenseInput) {
    const expense = await expensesRepository.create(ownerId, input);
    return toExpense(expense.toObject() as ExpenseDocument);
  },

  async createRunningCostExpense(ownerId: string, input: CreateRunningCostExpenseInput) {
    const expense = await expensesRepository.createRunningCost(ownerId, input);
    return toExpense(expense.toObject() as ExpenseDocument);
  },

  async updateExpense(ownerId: string, expenseId: string, input: UpdateExpenseInput) {
    await getOwnedExpense(ownerId, expenseId);

    if (
      input.title === undefined &&
      input.amount === undefined &&
      input.expenseDate === undefined &&
      input.notes === undefined
    ) {
      throw new ValidationError('At least one field is required');
    }

    const expense = await expensesRepository.updateById(expenseId, input);

    if (!expense) {
      throw new NotFoundError('Expense not found');
    }

    return toExpense(expense as ExpenseDocument);
  },

  async deleteExpense(ownerId: string, expenseId: string) {
    await getOwnedExpense(ownerId, expenseId);
    await expensesRepository.deleteById(expenseId);
  },
};
