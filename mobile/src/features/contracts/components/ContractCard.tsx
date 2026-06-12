import { Pressable, View } from 'react-native';

import { AppText, Badge, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import {
  CONTRACT_MODE_LABELS,
  PAYMENT_FREQUENCY_LABELS,
  type Contract,
} from '../types/contracts.types';
import { createStyles } from './ContractCard.styles';

interface ContractCardProps {
  contract: Contract;
  onPress: (contractId: string) => void;
}

export function ContractCard({ contract, onPress }: ContractCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable onPress={() => onPress(contract.id)} accessibilityRole="button">
      <Card padding="md">
        <View style={styles.header}>
          <AppText variant="heading3">
            {contract.car.brand} {contract.car.model}
          </AppText>
          <Badge label="Active" variant="success" size="sm" />
        </View>
        <AppText variant="bodySmall" color="textSecondary" style={styles.meta}>
          {CONTRACT_MODE_LABELS[contract.contractMode]} ·{' '}
          {PAYMENT_FREQUENCY_LABELS[contract.paymentFrequency]}
        </AppText>
        <AppText variant="body">
          Rent: {contract.rentAmount.toLocaleString()} /{' '}
          {PAYMENT_FREQUENCY_LABELS[contract.paymentFrequency].toLowerCase()}
        </AppText>
        <AppText variant="caption" color="textTertiary">
          {contract.startDate.slice(0, 10)} → {contract.endDate.slice(0, 10)}
        </AppText>
      </Card>
    </Pressable>
  );
}
