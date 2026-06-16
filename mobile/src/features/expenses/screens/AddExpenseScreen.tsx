import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { todayDateInputValue } from '@/shared/utils/formatExpenseDate';
import {
  formatAmountFieldValue,
  handleAmountFieldChange,
} from '@/shared/utils/numericInput';
import {
  AppStatusBar,
  AppText,
  Button,
  DateInput,
  Input,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { endOfToday } from '@/shared/utils/dateInput';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { MainStackParamList } from '@/app/navigation/types';

import { useCreateExpense } from '../hooks/useCreateExpense';
import {
  createExpenseFormSchema,
  type CreateExpenseFormValues,
} from '../validation/expense.schemas';

type AddExpenseScreenProps = NativeStackScreenProps<MainStackParamList, 'AddExpense'>;

export function AddExpenseScreen({ navigation }: AddExpenseScreenProps) {
  const createExpense = useCreateExpense();

  const { control, handleSubmit } = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseFormSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      amount: 0,
      expenseDate: todayDateInputValue(),
      notes: '',
    },
  });

  const onSubmit = (values: CreateExpenseFormValues) => {
    createExpense.mutate(
      {
        title: values.title.trim(),
        amount: values.amount,
        expenseDate: values.expenseDate,
        notes: values.notes?.trim() || undefined,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  };

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader title="Add expense" />

      {createExpense.isError ? (
        <AuthErrorBanner message={getErrorMessage(createExpense.error)} />
      ) : null}

      <AppText variant="caption" color="textSecondary">
        Track general spending here. Car repair costs stay under each personal-use car.
      </AppText>

      <Controller
        control={control}
        name="expenseDate"
        render={({ field, fieldState }) => (
          <DateInput
            label="Date"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            maximumDate={endOfToday()}
          />
        )}
      />

      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <Input
            label="Title"
            placeholder="e.g. Office supplies"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field, fieldState }) => (
          <Input
            label="Amount"
            placeholder="0"
            keyboardType="numeric"
            value={formatAmountFieldValue(field.value)}
            onChangeText={(text) => handleAmountFieldChange(text, field.onChange)}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field, fieldState }) => (
          <Input
            label="Notes (optional)"
            placeholder="Add any extra details"
            value={field.value ?? ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Button
        title="Save expense"
        onPress={handleSubmit(onSubmit)}
        loading={createExpense.isPending}
        fullWidth
      />
    </ScreenContainer>
  );
}
