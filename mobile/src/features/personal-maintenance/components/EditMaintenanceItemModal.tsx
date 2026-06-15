import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import type { PersonalMaintenanceChecklistItem } from '@/features/cars/types/cars.types';
import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_FREQUENCY_LABELS,
  MAINTENANCE_SCHEDULE_LABELS,
  MAINTENANCE_SCHEDULE_TYPES,
  type MaintenanceFrequency,
  type MaintenanceScheduleType,
} from '@/features/contracts/types/contracts.types';
import { AppModal, AppText, Button, Input } from '@/shared/components';
import { toDateInputValue } from '@/shared/utils/formatExpenseDate';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { computePersonalMaintenancePreview } from '../utils/maintenanceSchedulePreview';
import { MaintenanceOptionChips } from './MaintenanceOptionChips';
import { createStyles } from './EditMaintenanceItemModal.styles';

export interface EditMaintenanceItemValues {
  scheduleType: MaintenanceScheduleType;
  frequency?: MaintenanceFrequency;
  mileageIntervalKm?: number;
  lastCompletedAt: string | null;
  lastCompletedOdometerKm?: number | null;
}

interface EditMaintenanceItemModalProps {
  visible: boolean;
  item: PersonalMaintenanceChecklistItem | null;
  odometerKm: number;
  carCreatedAt: string;
  isSubmitting: boolean;
  error: unknown;
  onClose: () => void;
  onSave: (values: EditMaintenanceItemValues) => void;
}

export function EditMaintenanceItemModal({
  visible,
  item,
  odometerKm,
  carCreatedAt,
  isSubmitting,
  error,
  onClose,
  onSave,
}: EditMaintenanceItemModalProps) {
  const styles = useThemedStyles(createStyles);
  const [scheduleType, setScheduleType] = useState<MaintenanceScheduleType>('mileage');
  const [frequency, setFrequency] = useState<MaintenanceFrequency>('monthly');
  const [mileageIntervalKm, setMileageIntervalKm] = useState('');
  const [lastCompletedAt, setLastCompletedAt] = useState('');
  const [lastCompletedOdometerKm, setLastCompletedOdometerKm] = useState('');
  const [odometerError, setOdometerError] = useState<string | undefined>();

  useEffect(() => {
    if (!visible || !item) {
      return;
    }

    setScheduleType(item.scheduleType);
    setFrequency(item.frequency ?? 'monthly');
    setMileageIntervalKm(
      item.mileageIntervalKm != null ? String(item.mileageIntervalKm) : '5000',
    );
    setLastCompletedAt(item.lastCompletedAt ? toDateInputValue(item.lastCompletedAt) : '');
    setLastCompletedOdometerKm(
      item.lastCompletedOdometerKm != null
        ? String(item.lastCompletedOdometerKm)
        : item.lastCompletedAt
          ? String(odometerKm)
          : '',
    );
    setOdometerError(undefined);
  }, [visible, item, odometerKm]);

  const parsedMileageInterval = Number(mileageIntervalKm);
  const parsedLastOdometer =
    lastCompletedOdometerKm.trim() === '' ? null : Number(lastCompletedOdometerKm);

  const nextDuePreview = useMemo(() => {
    if (!item) {
      return null;
    }

    return computePersonalMaintenancePreview({
      scheduleType,
      frequency: scheduleType === 'time' ? frequency : null,
      mileageIntervalKm:
        scheduleType === 'mileage' && !Number.isNaN(parsedMileageInterval)
          ? parsedMileageInterval
          : null,
      lastCompletedAt: lastCompletedAt.trim() || null,
      lastCompletedOdometerKm:
        parsedLastOdometer != null && !Number.isNaN(parsedLastOdometer) ? parsedLastOdometer : null,
      odometerKm,
      carCreatedAt,
    });
  }, [
    item,
    scheduleType,
    frequency,
    parsedMileageInterval,
    lastCompletedAt,
    parsedLastOdometer,
    odometerKm,
    carCreatedAt,
  ]);

  const handleSave = () => {
    if (!item) {
      return;
    }

    if (scheduleType === 'mileage' && (Number.isNaN(parsedMileageInterval) || parsedMileageInterval <= 0)) {
      return;
    }

    const trimmedDate = lastCompletedAt.trim();
    let resolvedLastOdometer: number | null | undefined;

    if (scheduleType === 'mileage') {
      if (trimmedDate) {
        if (parsedLastOdometer == null || Number.isNaN(parsedLastOdometer)) {
          setOdometerError('Odometer at last change is required');
          return;
        }
        resolvedLastOdometer = parsedLastOdometer;
      } else {
        resolvedLastOdometer = null;
      }
    }

    onSave({
      scheduleType,
      frequency: scheduleType === 'time' ? frequency : undefined,
      mileageIntervalKm: scheduleType === 'mileage' ? parsedMileageInterval : undefined,
      lastCompletedAt: trimmedDate || null,
      lastCompletedOdometerKm: resolvedLastOdometer,
    });
  };

  if (!item) {
    return null;
  }

  return (
    <AppModal visible={visible} onClose={onClose} title={`Edit ${item.title}`}>
      <AppText variant="bodySmall" color="textSecondary">
        Set how often this is due and when it was last done. Next due is calculated automatically.
      </AppText>

      {error ? <AuthErrorBanner message={getErrorMessage(error)} /> : null}

      <MaintenanceOptionChips
        label="Schedule type"
        options={MAINTENANCE_SCHEDULE_TYPES}
        selected={scheduleType}
        getLabel={(value) => MAINTENANCE_SCHEDULE_LABELS[value]}
        onSelect={setScheduleType}
      />

      {scheduleType === 'time' ? (
        <MaintenanceOptionChips
          label="Repeat every"
          options={MAINTENANCE_FREQUENCIES}
          selected={frequency}
          getLabel={(value) => MAINTENANCE_FREQUENCY_LABELS[value]}
          onSelect={setFrequency}
        />
      ) : (
        <Input
          label="Every (km)"
          placeholder="5000"
          keyboardType="number-pad"
          value={mileageIntervalKm}
          onChangeText={setMileageIntervalKm}
        />
      )}

      <Input
        label="Last done date"
        placeholder="YYYY-MM-DD"
        value={lastCompletedAt}
        onChangeText={setLastCompletedAt}
      />

      {scheduleType === 'mileage' ? (
        <Input
          label="Odometer at last change (km)"
          placeholder={String(odometerKm)}
          keyboardType="number-pad"
          value={lastCompletedOdometerKm}
          onChangeText={(value) => {
            setLastCompletedOdometerKm(value);
            if (odometerError) {
              setOdometerError(undefined);
            }
          }}
          error={odometerError}
        />
      ) : null}

      {nextDuePreview ? (
        <View style={styles.previewCard}>
          <AppText variant="caption" color="textSecondary">
            Next due
          </AppText>
          <AppText variant="body">
            {scheduleType === 'time' ? nextDuePreview : `At ${nextDuePreview}`}
          </AppText>
        </View>
      ) : null}

      <Button title="Save" onPress={handleSave} loading={isSubmitting} fullWidth />
      <Button title="Cancel" onPress={onClose} variant="ghost" fullWidth />
    </AppModal>
  );
}
