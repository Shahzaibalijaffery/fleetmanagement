import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppStatusBar,
  Button,
  EmptyState,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { AddSalaryModal } from '../components/AddSalaryModal';
import { ExpenseListCard } from '../components/ExpenseListCard';
import { ExpenseListSkeleton } from '../components/ExpenseListSkeleton';
import { ExpenseMonthPickerModal } from '../components/ExpenseMonthPickerModal';
import { ExpenseMonthSummary } from '../components/ExpenseMonthSummary';
import { useExpenses } from '../hooks/useExpenses';
import type { ExpenseListItem } from '../types/expenses.types';
import { formatExpenseMonth, getCurrentExpenseMonth } from '../utils/expenseMonth';
import { createStyles } from './AllExpensesScreen.styles';

type AllExpensesScreenProps = NativeStackScreenProps<MainStackParamList, 'AllExpenses'>;

export function AllExpensesScreen({ navigation }: AllExpensesScreenProps) {
  const styles = useThemedStyles(createStyles);
  const [includeCarExpenses, setIncludeCarExpenses] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentExpenseMonth);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);

  const filters = useMemo(
    () => ({
      includeCarExpenses,
      year: selectedMonth.year,
      month: selectedMonth.month,
    }),
    [includeCarExpenses, selectedMonth],
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useExpenses(filters);

  const expenses = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const totalSpent = data?.pages[0]?.totalSpent ?? 0;
  const salary = data?.pages[0]?.salary ?? null;
  const remainingSalary = data?.pages[0]?.remainingSalary ?? null;
  const monthLabel = formatExpenseMonth(selectedMonth);

  const handleExpensePress = useCallback(
    (expense: ExpenseListItem) => {
      if (expense.source === 'car' && expense.carId && expense.logId) {
        navigation.navigate('CarExpenseDetail', {
          carId: expense.carId,
          logId: expense.logId,
        });
        return;
      }

      navigation.navigate('ExpenseDetail', { expenseId: expense.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ExpenseListItem }) => (
      <ExpenseListCard expense={item} onPress={() => handleExpensePress(item)} />
    ),
    [handleExpensePress],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <ExpenseMonthSummary
          monthLabel={monthLabel}
          totalSpent={totalSpent}
          salary={salary}
          remainingSalary={remainingSalary}
          includeCarExpenses={includeCarExpenses}
          onIncludeCarExpensesChange={setIncludeCarExpenses}
          onChangeMonth={() => setShowMonthPicker(true)}
          onAddSalary={() => setShowSalaryModal(true)}
        />
      </View>
    ),
    [
      styles.listHeader,
      monthLabel,
      totalSpent,
      salary,
      remainingSalary,
      includeCarExpenses,
    ],
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="All expenses" style={styles.header} />
        <ExpenseListSkeleton />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="All expenses" style={styles.header} />
        <ErrorState
          message="Couldn't load expenses. Check your connection."
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <AppStatusBar />
      <ScreenHeader
        title="All expenses"
        style={styles.header}
        right={
          <Button
            title="Add"
            onPress={() => navigation.navigate('AddExpense')}
            size="sm"
          />
        }
      />

      <ExpenseMonthPickerModal
        visible={showMonthPicker}
        selectedMonth={selectedMonth}
        onClose={() => setShowMonthPicker(false)}
        onSelect={setSelectedMonth}
      />

      <AddSalaryModal
        visible={showSalaryModal}
        month={selectedMonth}
        currentSalary={salary}
        onClose={() => setShowSalaryModal(false)}
      />

      {expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          {listHeader}
          <EmptyState
            title={
              includeCarExpenses
                ? `No expenses in ${monthLabel}`
                : `No general expenses in ${monthLabel}`
            }
            message="Add an expense for this month to get started."
            actionLabel="Add expense"
            onAction={() => navigation.navigate('AddExpense')}
          />
        </View>
      ) : (
        <FlashList
          data={expenses}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.source}-${item.id}`}
          style={styles.listContainer}
          contentContainerStyle={styles.list}
          ListHeaderComponent={listHeader}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <ExpenseListSkeleton count={1} />
              </View>
            ) : null
          }
        />
      )}
    </ScreenContainer>
  );
}
