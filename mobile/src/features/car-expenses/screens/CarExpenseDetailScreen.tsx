import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import {
  AppModal,
  AppStatusBar,
  AppText,
  Button,
  Card,
  ErrorState,
  Input,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { MainStackParamList } from '@/app/navigation/types';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { useAddCarExpenseItem } from '../hooks/useAddCarExpenseItem';
import { useCarExpenses } from '../hooks/useCarExpenses';
import { useDeleteCarExpense } from '../hooks/useDeleteCarExpense';
import { useDeleteCarExpenseItem } from '../hooks/useDeleteCarExpenseItem';
import { useUpdateCarExpense } from '../hooks/useUpdateCarExpense';
import { useUpdateCarExpenseItem } from '../hooks/useUpdateCarExpenseItem';
import type { CarExpenseItem } from '../types/car-expenses.types';
import { formatMoney } from '../utils/formatMoney';
import { toDateInputValue } from '../utils/formatExpenseDate';
import {
  addExpenseItemFormSchema,
  expenseItemSchema,
  updateExpenseVisitFormSchema,
  type AddExpenseItemFormValues,
  type EditExpenseItemFormValues,
  type UpdateExpenseVisitFormValues,
} from '../validation/car-expense.schemas';
import { createStyles } from './CarExpenseDetailScreen.styles';

type CarExpenseDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'CarExpenseDetail'>;

export function CarExpenseDetailScreen({ navigation, route }: CarExpenseDetailScreenProps) {
  const { carId, logId } = route.params;
  const styles = useThemedStyles(createStyles);
  const { data, isLoading, isError, refetch } = useCarExpenses(carId);
  const updateVisit = useUpdateCarExpense(carId, logId);
  const updateItem = useUpdateCarExpenseItem(carId, logId);
  const deleteItem = useDeleteCarExpenseItem(carId, logId);
  const deleteVisit = useDeleteCarExpense(carId);
  const addItem = useAddCarExpenseItem(carId, logId);

  const [editingItem, setEditingItem] = useState<CarExpenseItem | null>(null);
  const [showDeleteVisitModal, setShowDeleteVisitModal] = useState(false);

  const log = useMemo(
    () => data?.data.find((entry) => entry.id === logId),
    [data?.data, logId],
  );

  const visitForm = useForm<UpdateExpenseVisitFormValues>({
    resolver: zodResolver(updateExpenseVisitFormSchema),
    defaultValues: { expenseDate: '', visitTitle: '' },
  });

  const addItemForm = useForm<AddExpenseItemFormValues>({
    resolver: zodResolver(addExpenseItemFormSchema),
    defaultValues: { title: '', amount: 0 },
  });

  const editItemForm = useForm<EditExpenseItemFormValues>({
    resolver: zodResolver(expenseItemSchema),
    defaultValues: { title: '', amount: 0 },
  });

  useEffect(() => {
    if (log) {
      visitForm.reset({
        expenseDate: toDateInputValue(log.expenseDate),
        visitTitle: log.visitTitle ?? '',
      });
    }
  }, [log, visitForm]);

  useEffect(() => {
    if (editingItem) {
      editItemForm.reset({
        title: editingItem.title,
        amount: editingItem.amount,
      });
    }
  }, [editingItem, editItemForm]);

  const onSaveVisit = (values: UpdateExpenseVisitFormValues) => {
    updateVisit.mutate({
      expenseDate: values.expenseDate,
      visitTitle: values.visitTitle?.trim() || undefined,
    });
  };

  const onAddItem = (values: AddExpenseItemFormValues) => {
    addItem.mutate(values, {
      onSuccess: () => {
        addItemForm.reset({ title: '', amount: 0 });
      },
    });
  };

  const onSaveItem = (values: EditExpenseItemFormValues) => {
    if (!editingItem) {
      return;
    }

    updateItem.mutate(
      {
        itemId: editingItem.id,
        payload: values,
      },
      {
        onSuccess: () => {
          setEditingItem(null);
        },
      },
    );
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem.mutate(itemId, {
      onSuccess: (result) => {
        if (result === null) {
          navigation.goBack();
        }
      },
    });
  };

  const handleDeleteVisit = () => {
    deleteVisit.mutate(logId, {
      onSuccess: () => {
        setShowDeleteVisitModal(false);
        navigation.goBack();
      },
    });
  };

  const actionError =
    updateVisit.error ??
    updateItem.error ??
    deleteItem.error ??
    deleteVisit.error ??
    addItem.error;

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Repair expense" />
        <AppText variant="body" color="textSecondary">
          Loading...
        </AppText>
      </ScreenContainer>
    );
  }

  if (isError || !log) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Repair expense" />
        <ErrorState message="Couldn't load expense details." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader title="Repair expense" />

      {actionError ? <AuthErrorBanner message={getErrorMessage(actionError)} /> : null}

      <Card padding="md" style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="label">Visit details</AppText>
          <AppText variant="heading3" color="primary">
            {formatMoney(log.totalAmount)}
          </AppText>
        </View>

        <Controller
          control={visitForm.control}
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
          control={visitForm.control}
          name="visitTitle"
          render={({ field, fieldState }) => (
            <Input
              label="Workshop / visit (optional)"
              placeholder="e.g. Commercial Market workshop"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        <Button
          title="Save visit details"
          onPress={visitForm.handleSubmit(onSaveVisit)}
          loading={updateVisit.isPending}
          variant="outline"
          fullWidth
        />
      </Card>

      <Card padding="md" style={styles.section}>
        <AppText variant="label" style={styles.itemsTitle}>
          Line items
        </AppText>
        <View style={styles.itemsBlock}>
          {log.items.map((item, index) => (
            <View
              key={item.id}
              style={[styles.itemRow, index === log.items.length - 1 && styles.itemRowLast]}
            >
              <View style={styles.itemContent}>
                <AppText variant="bodySmall" style={styles.itemTitle}>
                  {item.title}
                </AppText>
                <AppText variant="bodySmall" color="textSecondary">
                  {formatMoney(item.amount)}
                </AppText>
              </View>
              <View style={styles.itemActions}>
                <Pressable onPress={() => setEditingItem(item)} accessibilityRole="button">
                  <AppText variant="caption" color="primary">
                    Edit
                  </AppText>
                </Pressable>
                <Pressable
                  onPress={() => handleDeleteItem(item.id)}
                  disabled={deleteItem.isPending}
                  accessibilityRole="button"
                >
                  <AppText variant="caption" color="error">
                    Delete
                  </AppText>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.form}>
        <AppText variant="label">Add another item</AppText>

        <Controller
          control={addItemForm.control}
          name="title"
          render={({ field, fieldState }) => (
            <Input
              label="Title"
              placeholder="Brake pads, battery, etc."
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={addItemForm.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Input
              label="Amount"
              value={field.value === 0 ? '' : String(field.value)}
              onChangeText={(text) => {
                const parsed = Number(text);
                field.onChange(Number.isNaN(parsed) ? 0 : parsed);
              }}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Button
          title="Add item"
          onPress={addItemForm.handleSubmit(onAddItem)}
          loading={addItem.isPending}
          fullWidth
        />
      </View>

      <Button
        title="Delete entire visit"
        onPress={() => setShowDeleteVisitModal(true)}
        variant="danger"
        fullWidth
        style={styles.deleteVisit}
      />

      <AppModal
        visible={editingItem != null}
        onClose={() => setEditingItem(null)}
        title="Edit line item"
      >
        <Controller
          control={editItemForm.control}
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
          control={editItemForm.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Input
              label="Amount"
              value={field.value === 0 ? '' : String(field.value)}
              onChangeText={(text) => {
                const parsed = Number(text);
                field.onChange(Number.isNaN(parsed) ? 0 : parsed);
              }}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Button
          title="Save changes"
          onPress={editItemForm.handleSubmit(onSaveItem)}
          loading={updateItem.isPending}
          fullWidth
        />
        <Button title="Cancel" onPress={() => setEditingItem(null)} variant="outline" fullWidth />
      </AppModal>

      <AppModal
        visible={showDeleteVisitModal}
        onClose={() => setShowDeleteVisitModal(false)}
        title="Delete this visit?"
      >
        <AppText variant="body">
          This will remove all line items for this repair visit. This cannot be undone.
        </AppText>
        <Button
          title="Delete visit"
          onPress={handleDeleteVisit}
          variant="danger"
          loading={deleteVisit.isPending}
          fullWidth
        />
        <Button
          title="Cancel"
          onPress={() => setShowDeleteVisitModal(false)}
          variant="outline"
          fullWidth
        />
      </AppModal>
    </ScreenContainer>
  );
}
