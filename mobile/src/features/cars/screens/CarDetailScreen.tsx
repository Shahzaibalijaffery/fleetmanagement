import { useState } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppModal,
  AppStatusBar,
  AppText,
  Button,
  Card,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { CarExpensesSection } from '@/features/car-expenses';
import { PersonalMaintenanceSection } from '@/features/personal-maintenance';
import { useCarActiveAssignment } from '@/features/assignments/hooks/useCarActiveAssignment';
import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { CarDetailSkeleton } from '../components/CarDetailSkeleton';
import { CAR_TYPE_LABELS } from '../types/cars.types';
import { CarStatusBadge } from '../components/CarStatusBadge';
import { useCar } from '../hooks/useCar';
import { useDeleteCar } from '../hooks/useDeleteCar';
import { createStyles } from './CarDetailScreen.styles';

type CarDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'CarDetail'>;

export function CarDetailScreen({ navigation, route }: CarDetailScreenProps) {
  const { carId } = route.params;
  const styles = useThemedStyles(createStyles);
  const { data, isLoading, isError, refetch } = useCar(carId);
  const { data: assignment } = useCarActiveAssignment(carId, data?.status === 'assigned');
  const deleteCar = useDeleteCar();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    deleteCar.mutate(carId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        navigation.navigate('CarList', {});
      },
    });
  };

  if (isLoading) {
    return (
      <ScreenContainer scrollable>
        <AppStatusBar />
        <ScreenHeader title="Car details" />
        <CarDetailSkeleton />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Car details" />
        <ErrorState
          message="Couldn't load car details."
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const canDelete = data.status !== 'assigned';

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader
        title={`${data.brand} ${data.model}`}
        right={<CarStatusBadge status={data.status} />}
      />

      <Card padding="md">
        <DetailRow label="Year" value={String(data.year)} />
        <DetailRow label="Type" value={CAR_TYPE_LABELS[data.carType] ?? data.carType} />
        <DetailRow label="Registration" value={data.registrationNumber} />
        <DetailRow label="City" value={data.city} />
      </Card>

      {data.status === 'personal_use' ? (
        <AppText variant="caption" color="textSecondary" style={styles.hint}>
          Personal use — track running costs (oil, wash) and repair bills separately. Not listed for
          drivers.
        </AppText>
      ) : null}

      {data.status === 'personal_use' ? (
        <PersonalMaintenanceSection car={data} navigation={navigation} />
      ) : null}

      {data.status === 'personal_use' ? (
        <CarExpensesSection carId={carId} navigation={navigation} />
      ) : null}

      {data.status === 'assigned' && assignment ? (
        <Card padding="md" style={styles.assignment}>
          <AppText variant="label" color="textSecondary" style={styles.assignmentLabel}>
            Assigned driver
          </AppText>
          <AppText variant="body">{assignment.driver.name}</AppText>
          <AppText variant="bodySmall" color="textSecondary">
            {assignment.driver.city ?? 'City not set'}
            {assignment.driver.experience != null
              ? ` · ${assignment.driver.experience} yrs experience`
              : ''}
          </AppText>
        </Card>
      ) : null}

      <Button
        title="Edit car"
        onPress={() => navigation.navigate('EditCar', { carId })}
        style={styles.action}
        fullWidth
      />

      <Button
        title="Delete car"
        onPress={() => setShowDeleteModal(true)}
        variant="danger"
        disabled={!canDelete}
        fullWidth
      />

      {!canDelete ? (
        <AppText variant="caption" color="textSecondary" style={styles.hint}>
          Assigned cars cannot be deleted.
        </AppText>
      ) : null}

      {deleteCar.isError ? (
        <AuthErrorBanner message={getErrorMessage(deleteCar.error)} />
      ) : null}

      <AppModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete car?"
      >
        <AppText variant="body">
          This will permanently remove {data.brand} {data.model} from your fleet.
        </AppText>
        <Button
          title="Delete"
          onPress={handleDelete}
          variant="danger"
          loading={deleteCar.isPending}
          fullWidth
        />
        <Button
          title="Cancel"
          onPress={() => setShowDeleteModal(false)}
          variant="outline"
          fullWidth
        />
      </AppModal>
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
