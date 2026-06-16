import { Pressable } from 'react-native';

import { formatExpenseDate } from '@/shared/utils/formatExpenseDate';
import { Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { ExpenseListItem } from '../types/expenses.types';
import {
  ExpenseListCardContent,
  getExpenseListCardContent,
} from './ExpenseListCardContent';
import { createStyles } from './ExpenseListCard.styles';

interface ExpenseListCardProps {
  expense: ExpenseListItem;
  onPress: () => void;
}

export function ExpenseListCard({ expense, onPress }: ExpenseListCardProps) {
  const styles = useThemedStyles(createStyles);
  const content = getExpenseListCardContent(expense);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${expense.title} on ${formatExpenseDate(expense.expenseDate)}`}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card padding="md" style={styles.card}>
        <ExpenseListCardContent
          {...content}
          dateLabel={formatExpenseDate(expense.expenseDate)}
        />
      </Card>
    </Pressable>
  );
}
