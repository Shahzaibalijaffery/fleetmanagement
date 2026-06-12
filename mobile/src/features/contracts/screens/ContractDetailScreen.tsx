import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppStatusBar,
  AppText,
  Button,
  Card,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import { useAuthStore } from '@/stores/auth.store';
import type { MainStackParamList } from '@/app/navigation/types';

import { ContractDetailSkeleton } from '../components/ContractDetailSkeleton';
import { MaintenanceChecklistSection } from '../components/MaintenanceChecklistSection';
import { useContract } from '../hooks/useContract';
import {
  CONTRACT_MODE_LABELS,
  PAYMENT_FREQUENCY_LABELS,
  RESPONSIBILITY_LABELS,
} from '../types/contracts.types';
import { createStyles } from './ContractDetailScreen.styles';

type ContractDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'ContractDetail'>;

export function ContractDetailScreen({ navigation, route }: ContractDetailScreenProps) {
  const { contractId } = route.params;
  const styles = useThemedStyles(createStyles);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, refetch } = useContract(contractId);

  if (isLoading) {
    return (
      <ScreenContainer scrollable>
        <AppStatusBar />
        <ScreenHeader title="Contract" />
        <ContractDetailSkeleton />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Contract" />
        <ErrorState message="Couldn't load contract." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader
        title={`${data.car.brand} ${data.car.model}`}
        subtitle={`Driver: ${data.driver.name}`}
      />

      <Card padding="md">
        <DetailRow label="Mode" value={CONTRACT_MODE_LABELS[data.contractMode]} />
        <DetailRow
          label="Payment"
          value={PAYMENT_FREQUENCY_LABELS[data.paymentFrequency]}
        />
        <DetailRow label="Rent amount" value={data.rentAmount.toLocaleString()} />
        <DetailRow label="Start date" value={data.startDate.slice(0, 10)} />
        <DetailRow label="End date" value={data.endDate.slice(0, 10)} />
        <DetailRow
          label="Current odometer"
          value={`${data.currentOdometerKm.toLocaleString()} km`}
        />
      </Card>

      <MaintenanceChecklistSection contract={data} />

      <Card padding="md" style={styles.section}>
        <AppText variant="label" color="textSecondary" style={styles.sectionTitle}>
          Responsibilities
        </AppText>
        <DetailRow label="Fuel" value={RESPONSIBILITY_LABELS[data.fuelResponsibility]} />
        <DetailRow
          label="Maintenance"
          value={RESPONSIBILITY_LABELS[data.maintenanceResponsibility]}
        />
        <DetailRow label="Damage" value={RESPONSIBILITY_LABELS[data.damageResponsibility]} />
      </Card>

      {user?.role === 'owner' ? (
        <Button
          title="Edit contract"
          onPress={() => navigation.navigate('EditContract', { contractId })}
          style={styles.action}
          fullWidth
        />
      ) : null}
    </ScreenContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}
