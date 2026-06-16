import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { AppModal, AppText, Button, DateInput, Input } from '@/shared/components';
import { toDateInputValue } from '@/shared/utils/formatExpenseDate';
import { endOfToday } from '@/shared/utils/dateInput';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { sanitizeIntegerInput } from '@/shared/utils/numericInput';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { computePersonalMaintenancePreview } from '../utils/maintenanceSchedulePreview';
import {
  editMaintenanceItemFormSchema,
  resolveEditMaintenanceValues,
  type EditMaintenanceItemFormValues,
} from '../validation/maintenance-modal.schemas';
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

  const { control, handleSubmit, reset, watch, setValue } = useForm<EditMaintenanceItemFormValues>({
    resolver: zodResolver(editMaintenanceItemFormSchema),
    mode: 'onBlur',
    defaultValues: {
      scheduleType: 'mileage',
      frequency: 'monthly',
      mileageIntervalKm: '5000',
      lastCompletedAt: '',
      lastCompletedOdometerKm: '',
    },
  });

  const scheduleType = watch('scheduleType');
  const frequency = watch('frequency');
  const mileageIntervalKm = watch('mileageIntervalKm');
  const lastCompletedAt = watch('lastCompletedAt');
  const lastCompletedOdometerKm = watch('lastCompletedOdometerKm');

  useEffect(() => {
    if (!visible || !item) {
      return;
    }

    reset({
      scheduleType: item.scheduleType,
      frequency: item.frequency ?? 'monthly',
      mileageIntervalKm:
        item.mileageIntervalKm != null ? String(item.mileageIntervalKm) : '5000',
      lastCompletedAt: item.lastCompletedAt ? toDateInputValue(item.lastCompletedAt) : '',
      lastCompletedOdometerKm:
        item.lastCompletedOdometerKm != null
          ? String(item.lastCompletedOdometerKm)
          : item.lastCompletedAt
            ? String(odometerKm)
            : '',
    });
  }, [visible, item, odometerKm, reset]);

  const parsedMileageInterval = Number(mileageIntervalKm);
  const parsedLastOdometer =
    lastCompletedOdometerKm?.trim() === '' ? null : Number(lastCompletedOdometerKm);

  const nextDuePreview = useMemo(() => {
    if (!item) {
      return null;
    }

    return computePersonalMaintenancePreview({
      scheduleType,
      frequency: scheduleType === 'time' ? (frequency ?? 'monthly') : null,
      mileageIntervalKm:
        scheduleType === 'mileage' && !Number.isNaN(parsedMileageInterval)
          ? parsedMileageInterval
          : null,
      lastCompletedAt: lastCompletedAt?.trim() || null,
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

  const onSubmit = (values: EditMaintenanceItemFormValues) => {
    if (!item) {
      return;
    }

    onSave(resolveEditMaintenanceValues(values));
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
        onSelect={(value) => setValue('scheduleType', value, { shouldValidate: true })}
      />

      {scheduleType === 'time' ? (
        <MaintenanceOptionChips
          label="Repeat every"
          options={MAINTENANCE_FREQUENCIES}
          selected={frequency ?? 'monthly'}
          getLabel={(value) => MAINTENANCE_FREQUENCY_LABELS[value]}
          onSelect={(value) => setValue('frequency', value, { shouldValidate: true })}
        />
      ) : (
        <Controller
          control={control}
          name="mileageIntervalKm"
          render={({ field, fieldState }) => (
            <Input
              label="Every (km)"
              placeholder="5000"
              keyboardType="number-pad"
              value={field.value ?? ''}
              onChangeText={(value) => field.onChange(sanitizeIntegerInput(value))}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      )}

      <Controller
        control={control}
        name="lastCompletedAt"
        render={({ field, fieldState }) => (
          <DateInput
            label="Last done date"
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            maximumDate={endOfToday()}
            placeholder="Optional"
          />
        )}
      />

      {scheduleType === 'mileage' ? (
        <Controller
          control={control}
          name="lastCompletedOdometerKm"
          render={({ field, fieldState }) => (
            <Input
              label="Odometer at last change (km)"
              placeholder={String(odometerKm)}
              keyboardType="number-pad"
              value={field.value ?? ''}
              onChangeText={(value) => field.onChange(sanitizeIntegerInput(value))}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
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

      <Button title="Save" onPress={handleSubmit(onSubmit)} loading={isSubmitting} fullWidth />
      <Button title="Cancel" onPress={onClose} variant="ghost" fullWidth />
    </AppModal>
  );
}
