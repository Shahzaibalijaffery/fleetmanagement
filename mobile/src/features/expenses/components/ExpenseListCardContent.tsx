import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, Badge } from '@/shared/components';
import { formatMoney } from '@/shared/utils/formatMoney';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { ExpenseListItem } from '../types/expenses.types';
import { createStyles } from './ExpenseListCard.styles';

export interface ExpenseListCardContentProps {
  dateLabel: string;
  badgeLabel: string;
  badgeVariant: 'primary' | 'warning' | 'neutral';
  title: string;
  subtitle?: string;
  amount: number;
  amountSuffix?: ReactNode;
}

export function getExpenseListCardContent(expense: ExpenseListItem): ExpenseListCardContentProps {
  const badge =
    expense.source === 'car'
      ? { label: 'Car repair', variant: 'primary' as const }
      : expense.source === 'running_cost'
        ? { label: 'Running cost', variant: 'warning' as const }
        : { label: 'General', variant: 'neutral' as const };

  const showCarLabel = expense.source === 'car' || expense.source === 'running_cost';
  let subtitle: string | undefined;

  if (showCarLabel && expense.carLabel) {
    subtitle = expense.carLabel;

    if (expense.source === 'car' && expense.itemCount) {
      subtitle += ` · ${expense.itemCount} items`;
    }
  } else if (expense.notes) {
    subtitle = expense.notes;
  }

  return {
    dateLabel: expense.expenseDate,
    badgeLabel: badge.label,
    badgeVariant: badge.variant,
    title: expense.title,
    subtitle,
    amount: expense.amount,
  };
}

export function ExpenseListCardContent({
  dateLabel,
  badgeLabel,
  badgeVariant,
  title,
  subtitle,
  amount,
  amountSuffix,
}: ExpenseListCardContentProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <View style={styles.metaRow}>
          <AppText variant="label">{dateLabel}</AppText>
          <Badge label={badgeLabel} variant={badgeVariant} size="sm" />
        </View>
        <AppText variant="body" numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.amountBlock}>
        <AppText variant="heading3" color="primary">
          {formatMoney(amount)}
        </AppText>
        {amountSuffix}
      </View>
    </View>
  );
}
