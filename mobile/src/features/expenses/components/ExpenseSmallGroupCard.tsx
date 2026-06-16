import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View, type LayoutChangeEvent } from 'react-native';

import { formatExpenseDate } from '@/shared/utils/formatExpenseDate';
import { Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { ExpenseListItem } from '../types/expenses.types';
import { getSmallGroupTotal } from '../utils/groupSmallExpenses';
import { ExpenseListCard } from './ExpenseListCard';
import { ExpenseListCardContent } from './ExpenseListCardContent';
import { createStyles } from './ExpenseListCard.styles';
import { createStyles as createGroupStyles } from './ExpenseSmallGroupCard.styles';

const EXPAND_DURATION_MS = 240;

interface ExpenseSmallGroupCardProps {
  expenses: ExpenseListItem[];
  isExpanded: boolean;
  onToggle: () => void;
  onExpensePress: (expense: ExpenseListItem) => void;
}

export function ExpenseSmallGroupCard({
  expenses,
  isExpanded,
  onToggle,
  onExpensePress,
}: ExpenseSmallGroupCardProps) {
  const styles = useThemedStyles(createStyles);
  const groupStyles = useThemedStyles(createGroupStyles);
  const latestExpense = expenses[0];
  const totalAmount = getSmallGroupTotal(expenses);
  const itemLabel = expenses.length === 1 ? '1 item' : `${expenses.length} items`;

  const [contentHeight, setContentHeight] = useState(0);
  const expandProgress = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const chevronRotation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    setContentHeight(0);
  }, [expenses]);

  useEffect(() => {
    Animated.timing(chevronRotation, {
      toValue: isExpanded ? 1 : 0,
      duration: EXPAND_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [chevronRotation, isExpanded]);

  useEffect(() => {
    if (isExpanded && contentHeight === 0) {
      return;
    }

    Animated.timing(expandProgress, {
      toValue: isExpanded ? 1 : 0,
      duration: EXPAND_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [contentHeight, expandProgress, isExpanded]);

  const handleContentLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;

    if (nextHeight !== contentHeight) {
      setContentHeight(nextHeight);
    }
  };

  const animatedHeight = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(contentHeight, 1)],
  });

  const animatedOpacity = expandProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.6, 1],
  });

  const chevronTransform = chevronRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const renderExpandedItems = () =>
    expenses.map((expense, index) => (
      <View key={`${expense.source}-${expense.id}`}>
        {index > 0 ? <View style={groupStyles.separator} /> : null}
        <ExpenseListCard expense={expense} onPress={() => onExpensePress(expense)} />
      </View>
    ));

  return (
    <View style={groupStyles.wrapper}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`Small expenses, ${itemLabel}, total ${totalAmount}`}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <Card
          padding="md"
          style={[styles.card, groupStyles.groupCard, groupStyles.groupAccent]}
        >
          <ExpenseListCardContent
            dateLabel={formatExpenseDate(latestExpense.expenseDate)}
            badgeLabel="Grouped"
            badgeVariant="neutral"
            title="Small expenses"
            subtitle={itemLabel}
            amount={totalAmount}
            amountSuffix={
              <Animated.Text
                style={[groupStyles.chevron, { transform: [{ rotate: chevronTransform }] }]}
              >
                ▼
              </Animated.Text>
            }
          />
        </Card>
      </Pressable>

      {contentHeight === 0 ? (
        <View style={groupStyles.measureHidden} pointerEvents="none" onLayout={handleContentLayout}>
          <View style={groupStyles.expandedList}>{renderExpandedItems()}</View>
        </View>
      ) : null}

      <Animated.View
        style={[
          groupStyles.expandedContainer,
          {
            height: contentHeight > 0 ? animatedHeight : 0,
            opacity: animatedOpacity,
          },
        ]}
        pointerEvents={isExpanded ? 'auto' : 'none'}
      >
        <View style={groupStyles.expandedList}>{renderExpandedItems()}</View>
      </Animated.View>
    </View>
  );
}
