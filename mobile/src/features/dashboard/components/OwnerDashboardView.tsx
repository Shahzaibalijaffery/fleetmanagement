import { View } from 'react-native';

import { AppText, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { CarStatus } from '@/features/cars/types/cars.types';

import type { OwnerDashboard } from '../types/dashboard.types';
import { StatCard } from './StatCard';
import { createStyles } from './OwnerDashboardView.styles';

interface OwnerDashboardViewProps {
  data: OwnerDashboard;
  onCarStatPress: (status?: CarStatus) => void;
}

function formatAmount(amount: number): string {
  return amount.toLocaleString();
}

export function OwnerDashboardView({ data, onCarStatPress }: OwnerDashboardViewProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="label" color="primary" style={styles.sectionTitle}>
        Fleet overview
      </AppText>
      <View style={styles.grid}>
        <StatCard
          label="Total cars"
          value={String(data.totalCars)}
          tone="primary"
          onPress={() => onCarStatPress()}
        />
        <StatCard
          label="Available"
          value={String(data.availableCars)}
          tone="success"
          onPress={() => onCarStatPress('available')}
        />
        <StatCard
          label="Assigned"
          value={String(data.assignedCars)}
          tone="accent"
          onPress={() => onCarStatPress('assigned')}
        />
        <StatCard
          label="Outstanding payments"
          value={formatAmount(data.outstandingPayments.totalAmount)}
          hint={`${data.outstandingPayments.count} pending`}
          tone="warning"
        />
      </View>

      <Card padding="md" accentTone="warning">
        <AppText variant="label" color="textSecondary">
          Payment summary
        </AppText>
        <AppText variant="body" style={styles.summaryText}>
          {data.outstandingPayments.count > 0
            ? `${data.outstandingPayments.count} payment(s) outstanding totalling ${formatAmount(data.outstandingPayments.totalAmount)}`
            : 'No outstanding payments'}
        </AppText>
      </Card>
    </View>
  );
}
