import { useEffect, useState } from 'react';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { AppModal, AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { useSetMonthlySalary } from '../hooks/useSetMonthlySalary';
import type { ExpenseMonth } from '../utils/expenseMonth';
import { formatExpenseMonth } from '../utils/expenseMonth';

interface AddSalaryModalProps {
  visible: boolean;
  month: ExpenseMonth;
  currentSalary: number | null;
  onClose: () => void;
}

export function AddSalaryModal({
  visible,
  month,
  currentSalary,
  onClose,
}: AddSalaryModalProps) {
  const setSalary = useSetMonthlySalary();
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (visible) {
      setAmount(currentSalary !== null ? String(currentSalary) : '');
    }
  }, [visible, currentSalary]);

  const handleSave = () => {
    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      return;
    }

    setSalary.mutate(
      {
        year: month.year,
        month: month.month,
        amount: parsedAmount,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title={currentSalary !== null ? 'Edit salary' : 'Add salary'}
    >
      <AppText variant="bodySmall" color="textSecondary">
        {formatExpenseMonth(month)}
      </AppText>

      {setSalary.isError ? (
        <AuthErrorBanner message={getErrorMessage(setSalary.error)} />
      ) : null}

      <Input
        label="Monthly salary"
        placeholder="0"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Button
        title="Save salary"
        onPress={handleSave}
        loading={setSalary.isPending}
        fullWidth
      />
      <Button title="Cancel" onPress={onClose} variant="ghost" fullWidth />
    </AppModal>
  );
}
