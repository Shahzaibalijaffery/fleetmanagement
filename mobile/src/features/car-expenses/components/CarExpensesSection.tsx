import { View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText, Button, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { useCarExpenses } from '../hooks/useCarExpenses';
import { formatMoney } from '../utils/formatMoney';
import { CarExpenseLogCard } from './CarExpenseLogCard';
import { createStyles } from './CarExpensesSection.styles';

interface CarExpensesSectionProps {
  carId: string;
  navigation: NativeStackNavigationProp<MainStackParamList>;
}

export function CarExpensesSection({ carId, navigation }: CarExpensesSectionProps) {
  const styles = useThemedStyles(createStyles);
  const { data, isLoading } = useCarExpenses(carId);

  const logs = data?.data ?? [];
  const totalSpent = data?.totalSpent ?? 0;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <AppText variant="label">Repairs & purchases</AppText>
        <AppText variant="caption" color="textSecondary">
          Repairs, new parts, and major work — not routine oil or wash.
        </AppText>
        <Button
          title="Add expense"
          onPress={() => navigation.navigate('AddCarExpense', { carId })}
          size="sm"
          style={styles.addButton}
        />
      </View>

      <Card padding="md" style={styles.totalCard} accentTone="primary">
        <AppText variant="caption" color="textSecondary">
          Total repair & purchase spend
        </AppText>
        <AppText variant="heading2">{isLoading ? '...' : formatMoney(totalSpent)}</AppText>
      </Card>

      {logs.length === 0 && !isLoading ? (
        <Card padding="md">
          <View style={styles.empty}>
            <AppText variant="body" color="textSecondary">
              No repair or purchase expenses yet.
            </AppText>
          </View>
        </Card>
      ) : null}

      {logs.map((log) => (
        <CarExpenseLogCard
          key={log.id}
          log={log}
          onPress={() => navigation.navigate('CarExpenseDetail', { carId, logId: log.id })}
        />
      ))}
    </View>
  );
}
