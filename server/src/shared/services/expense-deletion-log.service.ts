import { ExpenseDeletionLogModel } from '../../models/expense-deletion-log.model';
import type { ExpenseDeletionRecordType } from '../../models/expense-deletion-log.model';

interface CreateDeletionLogInput {
  ownerId: string;
  recordType: ExpenseDeletionRecordType;
  recordId: string;
  parentRecordId?: string | null;
  title: string;
  amount: number;
  expenseDate: Date;
  carId?: string | null;
  visitTitle?: string | null;
  snapshot: Record<string, unknown>;
}

function logToConsole(input: CreateDeletionLogInput) {
  console.log('[expense-audit] deleted', {
    recordType: input.recordType,
    recordId: input.recordId,
    title: input.title,
    amount: input.amount,
    expenseDate: input.expenseDate.toISOString(),
  });
}

async function createDeletionLog(input: CreateDeletionLogInput) {
  logToConsole(input);

  await ExpenseDeletionLogModel.create({
    ownerId: input.ownerId,
    recordType: input.recordType,
    recordId: input.recordId,
    parentRecordId: input.parentRecordId ?? null,
    title: input.title.trim(),
    amount: input.amount,
    expenseDate: input.expenseDate,
    carId: input.carId ?? null,
    visitTitle: input.visitTitle?.trim() || null,
    snapshot: input.snapshot,
    deletedAt: new Date(),
  });
}

function serializeExpense(expense: {
  _id: { toString(): string };
  ownerId: { toString(): string };
  source?: string;
  title: string;
  amount: number;
  expenseDate: Date;
  notes?: string;
  carId?: { toString(): string } | null;
  maintenanceItemId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: expense._id.toString(),
    ownerId: expense.ownerId.toString(),
    source: expense.source ?? 'general',
    title: expense.title,
    amount: expense.amount,
    expenseDate: expense.expenseDate.toISOString(),
    notes: expense.notes ?? null,
    carId: expense.carId?.toString() ?? null,
    maintenanceItemId: expense.maintenanceItemId ?? null,
    createdAt: expense.createdAt?.toISOString() ?? null,
    updatedAt: expense.updatedAt?.toISOString() ?? null,
  };
}

function serializeCarLog(log: {
  _id: { toString(): string };
  ownerId: { toString(): string };
  carId: { toString(): string };
  expenseDate: Date;
  visitTitle?: string | null;
  items: Array<{ _id: { toString(): string }; title: string; amount: number }>;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  const items = log.items.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    amount: item.amount,
  }));

  return {
    id: log._id.toString(),
    ownerId: log.ownerId.toString(),
    carId: log.carId.toString(),
    expenseDate: log.expenseDate.toISOString(),
    visitTitle: log.visitTitle ?? null,
    items,
    totalAmount: items.reduce((total, item) => total + item.amount, 0),
    createdAt: log.createdAt?.toISOString() ?? null,
    updatedAt: log.updatedAt?.toISOString() ?? null,
  };
}

export const expenseDeletionLogService = {
  async recordGeneralExpenseDeletion(
    ownerId: string,
    expense: Parameters<typeof serializeExpense>[0],
  ) {
    const source = expense.source === 'running_cost' ? 'running_cost' : 'general';
    const snapshot = serializeExpense(expense);

    await createDeletionLog({
      ownerId,
      recordType: source,
      recordId: expense._id.toString(),
      title: expense.title,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      carId: expense.carId?.toString() ?? null,
      snapshot,
    });
  },

  async recordCarLogDeletion(
    ownerId: string,
    log: Parameters<typeof serializeCarLog>[0],
  ) {
    const snapshot = serializeCarLog(log);
    const items = log.items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      amount: item.amount,
    }));
    const totalAmount = items.reduce((total, item) => total + item.amount, 0);

    await createDeletionLog({
      ownerId,
      recordType: 'car_log',
      recordId: log._id.toString(),
      title: log.visitTitle?.trim() || 'Car repair / purchase',
      amount: totalAmount,
      expenseDate: log.expenseDate,
      carId: log.carId.toString(),
      visitTitle: log.visitTitle ?? null,
      snapshot,
    });
  },

  async recordCarLogItemDeletion(
    ownerId: string,
    log: Parameters<typeof serializeCarLog>[0],
    item: { _id: { toString(): string }; title: string; amount: number },
  ) {
    const snapshot = {
      ...serializeCarLog(log),
      deletedItem: {
        id: item._id.toString(),
        title: item.title,
        amount: item.amount,
      },
    };

    await createDeletionLog({
      ownerId,
      recordType: 'car_log_item',
      recordId: item._id.toString(),
      parentRecordId: log._id.toString(),
      title: item.title,
      amount: item.amount,
      expenseDate: log.expenseDate,
      carId: log.carId.toString(),
      visitTitle: log.visitTitle ?? null,
      snapshot,
    });
  },
};
