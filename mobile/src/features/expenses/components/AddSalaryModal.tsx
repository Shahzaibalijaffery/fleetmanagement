import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { AppModal, AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import {
  formatAmountFieldValue,
  handleAmountFieldChange,
} from '@/shared/utils/numericInput';

import { useSetMonthlySalary } from '../hooks/useSetMonthlySalary';
import type { ExpenseMonth } from '../utils/expenseMonth';
import { formatExpenseMonth } from '../utils/expenseMonth';
import {
  monthlySalaryFormSchema,
  type MonthlySalaryFormValues,
} from '../validation/expense.schemas';

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

  const { control, handleSubmit, reset } = useForm<MonthlySalaryFormValues>({
    resolver: zodResolver(monthlySalaryFormSchema),
    mode: 'onBlur',
    defaultValues: {
      amount: 0,
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        amount: currentSalary ?? 0,
      });
    }
  }, [visible, currentSalary, reset]);

  const onSubmit = (values: MonthlySalaryFormValues) => {
    setSalary.mutate(
      {
        year: month.year,
        month: month.month,
        amount: values.amount,
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

      <Controller
        control={control}
        name="amount"
        render={({ field, fieldState }) => (
          <Input
            label="Monthly salary"
            placeholder="0"
            keyboardType="numeric"
            value={formatAmountFieldValue(field.value)}
            onChangeText={(text) => handleAmountFieldChange(text, field.onChange)}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Button
        title="Save salary"
        onPress={handleSubmit(onSubmit)}
        loading={setSalary.isPending}
        fullWidth
      />
      <Button title="Cancel" onPress={onClose} variant="ghost" fullWidth />
    </AppModal>
  );
}
