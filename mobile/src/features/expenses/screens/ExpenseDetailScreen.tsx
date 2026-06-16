import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import {
  AppModal,
  AppStatusBar,
  AppText,
  Button,
  Card,
  DateInput,
  ErrorState,
  Input,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { formatExpenseDate, toDateInputValue } from '@/shared/utils/formatExpenseDate';
import { endOfToday } from '@/shared/utils/dateInput';
import { formatMoney } from '@/shared/utils/formatMoney';
import {
  formatAmountFieldValue,
  handleAmountFieldChange,
} from '@/shared/utils/numericInput';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { ExpenseListSkeleton } from '../components/ExpenseListSkeleton';
import { useDeleteExpense } from '../hooks/useDeleteExpense';
import { useExpense } from '../hooks/useExpense';
import { useUpdateExpense } from '../hooks/useUpdateExpense';
import {
  updateExpenseFormSchema,
  type UpdateExpenseFormValues,
} from '../validation/expense.schemas';
import { createStyles } from './ExpenseDetailScreen.styles';

type ExpenseDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'ExpenseDetail'>;

export function ExpenseDetailScreen({ navigation, route }: ExpenseDetailScreenProps) {
  const { expenseId } = route.params;
  const styles = useThemedStyles(createStyles);
  const { data, isLoading, isError, refetch } = useExpense(expenseId);
  const updateExpense = useUpdateExpense(expenseId);
  const deleteExpense = useDeleteExpense();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { control, handleSubmit, reset } = useForm<UpdateExpenseFormValues>({
    resolver: zodResolver(updateExpenseFormSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      amount: 0,
      expenseDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        amount: data.amount,
        expenseDate: toDateInputValue(data.expenseDate),
        notes: data.notes ?? '',
      });
    }
  }, [data, reset]);

  const onSubmit = (values: UpdateExpenseFormValues) => {
    updateExpense.mutate(
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

  const handleDelete = () => {
    deleteExpense.mutate(expenseId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        navigation.goBack();
      },
    });
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Expense detail" />
        <ExpenseListSkeleton count={2} />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Expense detail" />
        <ErrorState
          message="Couldn't load this expense. Check your connection."
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader title="Expense detail" />

      {updateExpense.isError ? (
        <AuthErrorBanner message={getErrorMessage(updateExpense.error)} />
      ) : null}

      {deleteExpense.isError ? (
        <AuthErrorBanner message={getErrorMessage(deleteExpense.error)} />
      ) : null}

      <View style={styles.content}>
        <Card padding="md" accentTone="primary" style={styles.amountCard}>
          <AppText variant="caption" color="textSecondary">
            {formatExpenseDate(data.expenseDate)}
          </AppText>
          <AppText variant="heading2">{formatMoney(data.amount)}</AppText>
        </Card>

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
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        <View style={styles.actions}>
          <Button
            title="Save changes"
            onPress={handleSubmit(onSubmit)}
            loading={updateExpense.isPending}
            fullWidth
          />
          <Button
            title="Delete expense"
            variant="outline"
            onPress={() => setShowDeleteModal(true)}
            fullWidth
          />
        </View>
      </View>

      <AppModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete expense?"
      >
        <AppText variant="body">This expense will be removed from your records.</AppText>
        <Button
          title="Delete"
          onPress={handleDelete}
          variant="danger"
          loading={deleteExpense.isPending}
          fullWidth
        />
        <Button
          title="Cancel"
          onPress={() => setShowDeleteModal(false)}
          variant="ghost"
          fullWidth
        />
      </AppModal>
    </ScreenContainer>
  );
}
