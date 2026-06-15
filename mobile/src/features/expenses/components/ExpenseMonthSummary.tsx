import { Pressable, Switch, View } from 'react-native';

import { AppText, Button, Card } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { formatMoney } from '@/shared/utils/formatMoney';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './ExpenseMonthSummary.styles';

interface ExpenseMonthSummaryProps {
  monthLabel: string;
  totalSpent: number;
  salary: number | null;
  remainingSalary: number | null;
  includeCarExpenses: boolean;
  onIncludeCarExpensesChange: (value: boolean) => void;
  onChangeMonth: () => void;
  onAddSalary: () => void;
}

function BreakdownRow({
  label,
  amount,
  tone = 'textPrimary',
  emphasize = false,
}: {
  label: string;
  amount: string;
  tone?: 'textPrimary' | 'textSecondary' | 'warning' | 'success';
  emphasize?: boolean;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.breakdownRow}>
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
      <AppText variant={emphasize ? 'heading3' : 'bodySmall'} color={tone}>
        {amount}
      </AppText>
    </View>
  );
}

export function ExpenseMonthSummary({
  monthLabel,
  totalSpent,
  salary,
  remainingSalary,
  includeCarExpenses,
  onIncludeCarExpensesChange,
  onChangeMonth,
  onAddSalary,
}: ExpenseMonthSummaryProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const hasSalary = salary !== null;
  const isOverBudget = remainingSalary !== null && remainingSalary < 0;

  return (
    <Card padding="md" accentTone="primary" style={styles.card}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={onChangeMonth}
          accessibilityRole="button"
          accessibilityLabel={`${monthLabel}. Tap to change month.`}
          style={({ pressed }) => [styles.monthButton, pressed && styles.pressed]}
        >
          <AppText variant="caption" color="textSecondary">
            Month
          </AppText>
          <View style={styles.monthRow}>
            <AppText variant="label" color="primary">
              {monthLabel}
            </AppText>
            <AppText variant="caption" color="primary">
              Change ›
            </AppText>
          </View>
        </Pressable>
        <Button
          title={hasSalary ? 'Edit salary' : 'Add salary'}
          onPress={onAddSalary}
          size="sm"
          variant="outline"
        />
      </View>

      <View style={styles.spendSection}>
        <AppText variant="caption" color="textSecondary">
          Total spend
        </AppText>
        <AppText variant="heading2">{formatMoney(totalSpent)}</AppText>
      </View>

      {hasSalary ? (
        <View style={styles.breakdown}>
          <BreakdownRow label="Salary" amount={formatMoney(salary)} />
          <BreakdownRow label="Expenses" amount={`− ${formatMoney(totalSpent)}`} tone="warning" />
          <BreakdownRow
            label="Available"
            amount={formatMoney(remainingSalary ?? 0)}
            tone={isOverBudget ? 'warning' : 'success'}
            emphasize
          />
        </View>
      ) : null}

      <View style={styles.toggleRow}>
        <AppText variant="caption" color="textSecondary" style={styles.toggleLabel}>
          Include car repair bills
        </AppText>
        <Switch
          value={includeCarExpenses}
          onValueChange={onIncludeCarExpensesChange}
          trackColor={{ false: theme.colors.border, true: theme.colors.primaryMuted }}
          thumbColor={includeCarExpenses ? theme.colors.primary : theme.colors.surface}
          accessibilityLabel="Include car repair bills in this month"
        />
      </View>
    </Card>
  );
}
