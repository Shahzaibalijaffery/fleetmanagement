import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { shareCsvFile } from '@/shared/utils/shareCsvFile';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { carExpensesService } from '../services/car-expenses.service';
import { buildCarExpensesCsv } from '../utils/exportCarExpensesCsv';

interface ExportCarExpensesInput {
  carId: string;
  carLabel: string;
}

export function useExportCarExpenses() {
  return useMutation({
    mutationFn: async ({ carId, carLabel }: ExportCarExpensesInput) => {
      const logs = await carExpensesService.fetchAllCarExpenses(carId);

      if (logs.length === 0) {
        throw new Error('No car expenses to export');
      }

      const csv = buildCarExpensesCsv(logs, carLabel);
      const safeName = carLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const filename = `car-expenses-${safeName || carId}.csv`;

      await shareCsvFile(filename, csv);
    },
    onError: (error) => {
      Alert.alert('Export failed', getErrorMessage(error));
    },
  });
}
