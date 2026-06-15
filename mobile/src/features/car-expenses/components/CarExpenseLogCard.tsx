import { Pressable, View } from 'react-native';

import { AppText, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { CarExpenseLog } from '../types/car-expenses.types';
import { formatExpenseDate } from '../utils/formatExpenseDate';
import { formatMoney } from '@/shared/utils/formatMoney';
import { createStyles } from './CarExpenseLogCard.styles';

interface CarExpenseLogCardProps {
  log: CarExpenseLog;
  onPress: () => void;
}

export function CarExpenseLogCard({ log, onPress }: CarExpenseLogCardProps) {
  const styles = useThemedStyles(createStyles);
  const itemCount = log.items.length;
  const previewItems = log.items.slice(0, 3);
  const hiddenCount = itemCount - previewItems.length;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Repair visit on ${formatExpenseDate(log.expenseDate)}`}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card padding="md" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <AppText variant="label">{formatExpenseDate(log.expenseDate)}</AppText>
            {log.visitTitle ? (
              <AppText
                variant="bodySmall"
                color="textSecondary"
                numberOfLines={2}
                style={styles.visitTitle}
              >
                {log.visitTitle}
              </AppText>
            ) : null}
          </View>
          <View style={styles.totalBlock}>
            <AppText variant="heading3" color="primary">
              {formatMoney(log.totalAmount)}
            </AppText>
            <AppText variant="caption" color="textTertiary">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </AppText>
          </View>
        </View>

        <View style={styles.itemsBlock}>
          {previewItems.map((item, index) => (
            <View
              key={item.id}
              style={[styles.itemRow, index === previewItems.length - 1 && styles.itemRowLast]}
            >
              <AppText variant="bodySmall" color="textPrimary" style={styles.itemTitle}>
                {item.title}
              </AppText>
              {itemCount > 1 ? (
                <AppText variant="bodySmall" color="textSecondary" style={styles.itemAmount}>
                  {formatMoney(item.amount)}
                </AppText>
              ) : null}
            </View>
          ))}
          {hiddenCount > 0 ? (
            <AppText variant="caption" color="textTertiary" style={styles.moreItems}>
              +{hiddenCount} more — tap to view
            </AppText>
          ) : (
            <AppText variant="caption" color="textTertiary" style={styles.moreItems}>
              Tap to view or add items
            </AppText>
          )}
        </View>
      </Card>
    </Pressable>
  );
}
