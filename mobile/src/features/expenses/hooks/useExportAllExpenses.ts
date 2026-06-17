import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { shareCsvFile } from '@/shared/utils/shareCsvFile';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { useAuthStore } from '@/stores/auth.store';

import { expensesService } from '../services/expenses.service';
import type { ExpensesListFilters } from '../types/expenses.types';
import { buildAllExpensesCsv } from '../utils/exportAllExpensesCsv';
import { expenseMonthKey, formatExpenseMonth } from '../utils/expenseMonth';

export function useExportAllExpenses() {
  const role = useAuthStore((state) => state.user?.role);

  return useMutation({
    mutationFn: async (filters: ExpensesListFilters) => {
      if (role !== 'owner' && role !== 'driver') {
        throw new Error('Sign in to export expenses');
      }

      const expenses = await expensesService.fetchAllExpensesForMonth(filters);

      if (expenses.length === 0) {
        throw new Error('No expenses to export for this month');
      }

      const monthLabel = formatExpenseMonth(filters);
      const csv = buildAllExpensesCsv(expenses, monthLabel, role);
      const filename = `all-expenses-${expenseMonthKey(filters)}.csv`;

      await shareCsvFile(filename, csv);
    },
    onError: (error) => {
      Alert.alert('Export failed', getErrorMessage(error));
    },
  });
}
