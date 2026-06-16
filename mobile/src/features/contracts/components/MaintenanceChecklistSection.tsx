import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { AppText, Badge, Button, Card, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { sanitizeIntegerInput } from '@/shared/utils/numericInput';
import { odometerUpdateFormSchema } from '@/shared/validation/field.schemas';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { useCompleteMaintenanceItem } from '../hooks/useCompleteMaintenanceItem';
import { useUpdateContractOdometer } from '../hooks/useUpdateContractOdometer';
import type { Contract, MaintenanceChecklistItem } from '../types/contracts.types';
import {
  MAINTENANCE_FREQUENCY_LABELS,
  MAINTENANCE_STATUS_LABELS,
} from '../types/contracts.types';
import { parseOdometerInput } from '../utils/parseOdometerInput';
import { createStyles } from './MaintenanceChecklistSection.styles';

interface MaintenanceChecklistSectionProps {
  contract: Contract;
}

function statusVariant(status: MaintenanceChecklistItem['status']) {
  switch (status) {
    case 'overdue':
      return 'error' as const;
    case 'due':
      return 'warning' as const;
    case 'contract_ended':
      return 'neutral' as const;
    default:
      return 'success' as const;
  }
}

function formatDueText(item: MaintenanceChecklistItem): string {
  if (item.scheduleType === 'time' && item.nextDueDate) {
    return `Next due: ${item.nextDueDate.slice(0, 10)}`;
  }

  if (item.scheduleType === 'mileage' && item.nextDueOdometerKm != null) {
    return `Next due at: ${item.nextDueOdometerKm.toLocaleString()} km`;
  }

  return 'No upcoming due date within contract';
}

export function MaintenanceChecklistSection({ contract }: MaintenanceChecklistSectionProps) {
  const styles = useThemedStyles(createStyles);
  const [odometerInput, setOdometerInput] = useState(String(contract.currentOdometerKm));
  const [odometerError, setOdometerError] = useState<string | undefined>();
  const [completingItemId, setCompletingItemId] = useState<string | null>(null);
  const updateOdometer = useUpdateContractOdometer(contract.id);
  const completeItem = useCompleteMaintenanceItem(contract.id);
  const isContractActive =
    contract.status === 'active' && new Date() <= new Date(contract.endDate);

  useEffect(() => {
    setOdometerInput(String(contract.currentOdometerKm));
  }, [contract.currentOdometerKm]);

  const handleUpdateOdometer = () => {
    const result = odometerUpdateFormSchema.safeParse({ odometer: odometerInput });

    if (!result.success) {
      setOdometerError(result.error.issues[0]?.message ?? 'Enter a valid odometer reading');
      return;
    }

    setOdometerError(undefined);
    const parsed = parseOdometerInput(odometerInput, contract.currentOdometerKm);
    updateOdometer.mutate(parsed);
  };

  const handleComplete = (item: MaintenanceChecklistItem) => {
    setCompletingItemId(item.id);
    completeItem.mutate(
      {
        itemId: item.id,
        currentOdometerKm:
          item.scheduleType === 'mileage'
            ? parseOdometerInput(
                odometerInput,
                Math.max(contract.currentOdometerKm, contract.initialOdometerKm),
              )
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
      <AppText variant="label" color="textSecondary" style={styles.sectionTitle}>
        Maintenance checklist
      </AppText>
      <AppText variant="caption" color="textSecondary">
        Active until {contract.endDate.slice(0, 10)}
      </AppText>

      <View style={styles.odometerRow}>
        <Input
          label="Current odometer (km)"
          value={odometerInput}
          onChangeText={(value) => {
            setOdometerInput(sanitizeIntegerInput(value));
            if (odometerError) {
              setOdometerError(undefined);
            }
          }}
          keyboardType="number-pad"
          error={odometerError}
        />
        <Button
          title="Update mileage"
          onPress={handleUpdateOdometer}
          loading={updateOdometer.isPending}
          size="sm"
          variant="outline"
          disabled={!isContractActive}
        />
      </View>

      {actionError ? <AuthErrorBanner message={getErrorMessage(actionError)} /> : null}

      {contract.maintenanceChecklist.length === 0 ? (
        <AppText variant="bodySmall" color="textSecondary">
          No maintenance items on this contract.
        </AppText>
      ) : (
        contract.maintenanceChecklist.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <AppText variant="body">{item.title}</AppText>
              <Badge
                label={MAINTENANCE_STATUS_LABELS[item.status]}
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
            {isContractActive && item.isWithinContractPeriod ? (
              <Button
                title="Mark complete"
                onPress={() => handleComplete(item)}
                loading={completeItem.isPending && completingItemId === item.id}
                size="sm"
                style={styles.action}
              />
            ) : null}
          </View>
        ))
      )}
    </Card>
  );
}
