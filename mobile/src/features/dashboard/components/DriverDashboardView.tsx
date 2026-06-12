import { View } from 'react-native';

import {
  CONTRACT_MODE_LABELS,
  PAYMENT_FREQUENCY_LABELS,
} from '@/features/contracts/types/contracts.types';
import type { ContractMode, PaymentFrequency } from '@/features/contracts/types/contracts.types';
import { AppText, Badge, Button, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { DriverDashboard } from '../types/dashboard.types';
import { StatCard } from './StatCard';
import { createStyles } from './DriverDashboardView.styles';

interface DriverDashboardViewProps {
  data: DriverDashboard;
  onViewContract?: (contractId: string) => void;
}

function formatAmount(amount: number): string {
  return amount.toLocaleString();
}

export function DriverDashboardView({ data, onViewContract }: DriverDashboardViewProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="label" color="primary" style={styles.sectionTitle}>
        Your dashboard
      </AppText>

      <View style={styles.grid}>
        <StatCard
          label="Pending payments"
          value={formatAmount(data.pendingPayments.totalAmount)}
          hint={`${data.pendingPayments.count} due`}
          tone="warning"
        />
      </View>

      <Card padding="md" accentTone="accent">
        <View style={styles.cardHeader}>
          <AppText variant="label" color="textSecondary">
            Assigned car
          </AppText>
          {data.assignedCar ? <Badge label="Active" variant="success" size="sm" /> : null}
        </View>
        {data.assignedCar ? (
          <>
            <AppText variant="heading3">
              {data.assignedCar.brand} {data.assignedCar.model}
            </AppText>
            <AppText variant="bodySmall" color="textSecondary">
              {data.assignedCar.year} · {data.assignedCar.city} ·{' '}
              {data.assignedCar.registrationNumber}
            </AppText>
          </>
        ) : (
          <AppText variant="body" color="textSecondary">
            No car assigned yet
          </AppText>
        )}
      </Card>

      <Card padding="md" accentTone="primary">
        <AppText variant="label" color="textSecondary" style={styles.cardLabel}>
          Current contract
        </AppText>
        {data.currentContract ? (
          <>
            <AppText variant="body">
              {CONTRACT_MODE_LABELS[data.currentContract.contractMode as ContractMode]} ·{' '}
              {PAYMENT_FREQUENCY_LABELS[data.currentContract.paymentFrequency as PaymentFrequency]}
            </AppText>
            <AppText variant="bodySmall" color="textSecondary" style={styles.contractMeta}>
              Rent: {formatAmount(data.currentContract.rentAmount)} /{' '}
              {PAYMENT_FREQUENCY_LABELS[
                data.currentContract.paymentFrequency as PaymentFrequency
              ].toLowerCase()}
            </AppText>
            <AppText variant="caption" color="textTertiary">
              {data.currentContract.startDate.slice(0, 10)} →{' '}
              {data.currentContract.endDate.slice(0, 10)}
            </AppText>
            {onViewContract ? (
              <Button
                title="View contract"
                onPress={() => onViewContract(data.currentContract!.id)}
                size="sm"
                variant="outline"
                style={styles.contractButton}
                fullWidth
              />
            ) : null}
          </>
        ) : (
          <AppText variant="body" color="textSecondary">
            {data.assignedCar ? 'Contract not created yet' : 'No active contract'}
          </AppText>
        )}
      </Card>
    </View>
  );
}
