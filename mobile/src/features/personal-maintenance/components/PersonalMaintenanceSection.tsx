import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import type { Car, PersonalMaintenanceChecklistItem } from '@/features/cars/types/cars.types';
import {
  MAINTENANCE_FREQUENCY_LABELS,
} from '@/features/contracts/types/contracts.types';
import { parseOdometerInput } from '@/features/contracts/utils/parseOdometerInput';
import type { MainStackParamList } from '@/app/navigation/types';
import { AppText, Badge, Button, Card, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { useCompletePersonalMaintenanceItem } from '../hooks/useCompletePersonalMaintenanceItem';
import { useUpdatePersonalOdometer } from '../hooks/useUpdatePersonalOdometer';
import { createStyles } from './PersonalMaintenanceSection.styles';

const STATUS_LABELS: Record<PersonalMaintenanceChecklistItem['status'], string> = {
  upcoming: 'Upcoming',
  due: 'Due now',
  overdue: 'Overdue',
};

function statusVariant(status: PersonalMaintenanceChecklistItem['status']) {
  switch (status) {
    case 'overdue':
      return 'error' as const;
    case 'due':
      return 'warning' as const;
    default:
      return 'success' as const;
  }
}

function formatDueText(item: PersonalMaintenanceChecklistItem): string {
  if (item.scheduleType === 'time' && item.nextDueDate) {
    return `Next due: ${item.nextDueDate.slice(0, 10)}`;
  }

  if (item.scheduleType === 'mileage' && item.nextDueOdometerKm != null) {
    return `Next due at: ${item.nextDueOdometerKm.toLocaleString()} km`;
  }

  return 'No upcoming due date';
}

interface PersonalMaintenanceSectionProps {
  car: Car;
  navigation: NativeStackNavigationProp<MainStackParamList>;
}

export function PersonalMaintenanceSection({ car, navigation }: PersonalMaintenanceSectionProps) {
  const styles = useThemedStyles(createStyles);
  const currentKm = car.personalCurrentOdometerKm ?? 0;
  const [odometerInput, setOdometerInput] = useState(String(currentKm));
  const [completingItemId, setCompletingItemId] = useState<string | null>(null);
  const updateOdometer = useUpdatePersonalOdometer(car.id);
  const completeItem = useCompletePersonalMaintenanceItem(car.id);
  const checklist = car.personalMaintenanceChecklist ?? [];

  useEffect(() => {
    setOdometerInput(String(car.personalCurrentOdometerKm ?? 0));
  }, [car.personalCurrentOdometerKm]);

  const handleUpdateOdometer = () => {
    updateOdometer.mutate(parseOdometerInput(odometerInput, currentKm));
  };

  const handleComplete = (item: PersonalMaintenanceChecklistItem) => {
    setCompletingItemId(item.id);
    const initialKm = car.personalInitialOdometerKm ?? 0;
    completeItem.mutate(
      {
        itemId: item.id,
        personalCurrentOdometerKm:
          item.scheduleType === 'mileage'
            ? parseOdometerInput(odometerInput, Math.max(currentKm, initialKm))
            : undefined,
      },
      {
        onSettled: () => setCompletingItemId(null),
      },
    );
  };

  const actionError = updateOdometer.error ?? completeItem.error;

  return (
    <Card padding="md" style={styles.section}>
      <View style={styles.sectionHeader}>
        <AppText variant="label" color="textSecondary" style={styles.sectionTitle}>
          Running costs & care
        </AppText>
        <AppText variant="caption" color="textSecondary">
          Oil change, wash, service — tracked on a cycle (not repair bills).
        </AppText>
        <Button
          title="Edit items"
          onPress={() => navigation.navigate('EditPersonalMaintenance', { carId: car.id })}
          size="sm"
          variant="outline"
          style={styles.editButton}
        />
      </View>

      <View style={styles.odometerRow}>
        <Input
          label="Current odometer (km)"
          value={odometerInput}
          onChangeText={setOdometerInput}
          keyboardType="number-pad"
        />
        <Button
          title="Update mileage"
          onPress={handleUpdateOdometer}
          loading={updateOdometer.isPending}
          size="sm"
          variant="outline"
        />
      </View>

      {actionError ? <AuthErrorBanner message={getErrorMessage(actionError)} /> : null}

      {checklist.length === 0 ? (
        <AppText variant="bodySmall" color="textSecondary">
          No maintenance items yet. Tap Edit items to add washing, oil change, etc.
        </AppText>
      ) : (
        checklist.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <AppText variant="body">{item.title}</AppText>
              <Badge
                label={STATUS_LABELS[item.status]}
                variant={statusVariant(item.status)}
                size="sm"
              />
            </View>
            <AppText variant="caption" color="textSecondary">
              {item.scheduleType === 'time' && item.frequency
                ? `Every ${MAINTENANCE_FREQUENCY_LABELS[item.frequency].toLowerCase()}`
                : `Every ${item.mileageIntervalKm?.toLocaleString() ?? '—'} km`}
            </AppText>
            <AppText variant="caption" color="textSecondary" style={styles.meta}>
              {formatDueText(item)}
            </AppText>
            {item.lastCompletedAt ? (
              <AppText variant="caption" color="textSecondary">
                Last done: {item.lastCompletedAt.slice(0, 10)}
                {item.lastCompletedOdometerKm != null
                  ? ` at ${item.lastCompletedOdometerKm.toLocaleString()} km`
                  : ''}
              </AppText>
            ) : null}
            <Button
              title="Mark complete"
              onPress={() => handleComplete(item)}
              loading={completeItem.isPending && completingItemId === item.id}
              size="sm"
              style={styles.action}
            />
          </View>
        ))
      )}
    </Card>
  );
}
