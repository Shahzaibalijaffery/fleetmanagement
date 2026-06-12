import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import {
  AppStatusBar,
  AppText,
  Button,
  Input,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { MainStackParamList } from '@/app/navigation/types';

import { ExpenseItemFields } from '../components/ExpenseItemFields';
import { useCreateCarExpense } from '../hooks/useCreateCarExpense';
import { todayDateInputValue } from '../utils/formatExpenseDate';
import {
  createExpenseFormSchema,
  type CreateExpenseFormValues,
} from '../validation/car-expense.schemas';

type AddCarExpenseScreenProps = NativeStackScreenProps<MainStackParamList, 'AddCarExpense'>;

export function AddCarExpenseScreen({ navigation, route }: AddCarExpenseScreenProps) {
  const { carId } = route.params;
  const createExpense = useCreateCarExpense(carId);

  const { control, handleSubmit } = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseFormSchema),
    defaultValues: {
      expenseDate: todayDateInputValue(),
      visitTitle: '',
      items: [{ title: '', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (values: CreateExpenseFormValues) => {
    createExpense.mutate(
      {
        expenseDate: values.expenseDate,
        visitTitle: values.visitTitle?.trim() || undefined,
        items: values.items,
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
      <ScreenHeader title="Add repair expense" />

      {createExpense.isError ? (
        <AuthErrorBanner message={getErrorMessage(createExpense.error)} />
      ) : null}

      <AppText variant="caption" color="textSecondary">
        Repairs and new parts only — not routine oil change or wash (track those under Running
        costs).
      </AppText>

      <Controller
        control={control}
        name="expenseDate"
        render={({ field, fieldState }) => (
          <Input
            label="Date"
            placeholder="YYYY-MM-DD"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="visitTitle"
        render={({ field, fieldState }) => (
          <Input
            label="Visit title (optional)"
            placeholder="e.g. Body shop visit"
            value={field.value ?? ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <View>
        <AppText variant="label">Expense items</AppText>
        {fields.map((field, index) => (
          <ExpenseItemFields
            key={field.id}
            index={index}
            control={control}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          />
        ))}
      </View>

      <Button
        title="Add another item"
        variant="outline"
        onPress={() => append({ title: '', amount: 0 })}
        fullWidth
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
