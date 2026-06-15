import { Pressable, View } from 'react-native';

import { formatExpenseDate } from '@/shared/utils/formatExpenseDate';
import { AppText, Badge, Card } from '@/shared/components';
import { formatMoney } from '@/shared/utils/formatMoney';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { ExpenseListItem } from '../types/expenses.types';
import { createStyles } from './ExpenseListCard.styles';

interface ExpenseListCardProps {
  expense: ExpenseListItem;
  onPress: () => void;
}

export function ExpenseListCard({ expense, onPress }: ExpenseListCardProps) {
  const styles = useThemedStyles(createStyles);
  const sourceBadge =
    expense.source === 'car'
      ? { label: 'Car repair', variant: 'primary' as const }
      : expense.source === 'running_cost'
        ? { label: 'Running cost', variant: 'warning' as const }
        : { label: 'General', variant: 'neutral' as const };
  const showCarLabel = expense.source === 'car' || expense.source === 'running_cost';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${expense.title} on ${formatExpenseDate(expense.expenseDate)}`}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card padding="md" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.metaRow}>
              <AppText variant="label">{formatExpenseDate(expense.expenseDate)}</AppText>
              <Badge label={sourceBadge.label} variant={sourceBadge.variant} size="sm" />
            </View>
            <AppText variant="body" numberOfLines={2}>
              {expense.title}
            </AppText>
            {showCarLabel && expense.carLabel ? (
              <AppText variant="caption" color="textSecondary">
                {expense.carLabel}
                {expense.source === 'car' && expense.itemCount
                  ? ` · ${expense.itemCount} items`
                  : ''}
              </AppText>
            ) : expense.notes ? (
              <AppText variant="caption" color="textSecondary" numberOfLines={2}>
                {expense.notes}
              </AppText>
            ) : null}
          </View>
          <View style={styles.amountBlock}>
            <AppText variant="heading3" color="primary">
              {formatMoney(expense.amount)}
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
