import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppModal, AppText, Badge } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { ExpenseMonth } from '../utils/expenseMonth';
import {
  expenseMonthKey,
  formatExpenseMonth,
  getCurrentExpenseMonth,
  getSelectableMonths,
  isSameExpenseMonth,
} from '../utils/expenseMonth';
import { createStyles } from './ExpenseMonthPickerModal.styles';

interface ExpenseMonthPickerModalProps {
  visible: boolean;
  selectedMonth: ExpenseMonth;
  onClose: () => void;
  onSelect: (month: ExpenseMonth) => void;
}

export function ExpenseMonthPickerModal({
  visible,
  selectedMonth,
  onClose,
  onSelect,
}: ExpenseMonthPickerModalProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const months = useMemo(() => getSelectableMonths(), []);
  const currentMonth = getCurrentExpenseMonth();

  const handleSelect = (month: ExpenseMonth) => {
    onSelect(month);
    onClose();
  };

  return (
    <AppModal visible={visible} onClose={onClose} title="Select month">
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {months.map((month) => {
          const isSelected = isSameExpenseMonth(month, selectedMonth);
          const isCurrent = isSameExpenseMonth(month, currentMonth);

          return (
            <Pressable
              key={expenseMonthKey(month)}
              onPress={() => handleSelect(month)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? theme.colors.primaryMuted : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <View style={styles.optionRow}>
                <AppText variant="body" color={isSelected ? 'primary' : 'textPrimary'}>
                  {formatExpenseMonth(month)}
                </AppText>
                {isCurrent ? <Badge label="Current" variant="success" size="sm" /> : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </AppModal>
  );
}
