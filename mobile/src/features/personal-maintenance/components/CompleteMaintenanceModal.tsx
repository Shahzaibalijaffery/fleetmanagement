import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import type { PersonalMaintenanceChecklistItem } from '@/features/cars/types/cars.types';
import { AppModal, AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import {
  parseDecimalInput,
  parseIntegerInput,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
} from '@/shared/utils/numericInput';

import {
  DUPLICATE_MILEAGE_COMPLETION_MESSAGE,
  isDuplicateMileageCompletion,
} from '../utils/duplicateMaintenanceCompletion';
import {
  completeMaintenanceFormSchema,
  type CompleteMaintenanceFormValues,
} from '../validation/maintenance-modal.schemas';

export interface CompleteMaintenanceValues {
  cost: number;
  odometerKm?: number;
}

interface CompleteMaintenanceModalProps {
  visible: boolean;
  item: PersonalMaintenanceChecklistItem | null;
  odometerKm: number;
  isSubmitting: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (values: CompleteMaintenanceValues) => void;
}

export function CompleteMaintenanceModal({
  visible,
  item,
  odometerKm,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: CompleteMaintenanceModalProps) {
  const isMileageBased = item?.scheduleType === 'mileage';
  const [formError, setFormError] = useState<string | undefined>();

  const { control, handleSubmit, reset, setValue } = useForm<CompleteMaintenanceFormValues>({
    resolver: zodResolver(completeMaintenanceFormSchema),
    mode: 'onBlur',
    defaultValues: {
      cost: '',
      odometer: '',
      isMileageBased: false,
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        cost: '',
        odometer: String(odometerKm),
        isMileageBased: item?.scheduleType === 'mileage',
      });
      setFormError(undefined);
    }
  }, [visible, item?.id, item?.scheduleType, odometerKm, reset]);

  useEffect(() => {
    setValue('isMileageBased', isMileageBased ?? false);
  }, [isMileageBased, setValue]);

  const onSubmit = (values: CompleteMaintenanceFormValues) => {
    if (!item) {
      return;
    }

    const payload: CompleteMaintenanceValues = {
      cost: parseDecimalInput(values.cost, 0),
    };

    if (isMileageBased) {
      payload.odometerKm = parseIntegerInput(values.odometer ?? '', odometerKm);

      if (isDuplicateMileageCompletion(item, payload.odometerKm)) {
        setFormError(DUPLICATE_MILEAGE_COMPLETION_MESSAGE);
        return;
      }
    }

    setFormError(undefined);
    onConfirm(payload);
  };

  if (!item) {
    return null;
  }

  return (
    <AppModal visible={visible} onClose={onClose} title="Mark as complete?">
      <AppText variant="bodySmall" color="textSecondary">
        Record the running cost for {item.title}. It will appear in All expenses.
      </AppText>

      {error ? <AuthErrorBanner message={getErrorMessage(error)} /> : null}
      {formError ? <AuthErrorBanner message={formError} /> : null}

      <Controller
        control={control}
        name="cost"
        render={({ field, fieldState }) => (
          <Input
            label="Cost (Rs.)"
            placeholder="0"
            keyboardType="numeric"
            value={field.value}
            onChangeText={(value) => {
              field.onChange(sanitizeDecimalInput(value));
              if (formError) {
                setFormError(undefined);
              }
            }}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      {isMileageBased ? (
        <Controller
          control={control}
          name="odometer"
          render={({ field, fieldState }) => (
            <Input
              label="Odometer (km)"
              placeholder="0"
              keyboardType="number-pad"
              value={field.value ?? ''}
              onChangeText={(value) => {
                field.onChange(sanitizeIntegerInput(value));
                if (formError) {
                  setFormError(undefined);
                }
              }}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      ) : null}

      <Button
        title="Confirm"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        fullWidth
      />
      <Button title="Cancel" onPress={onClose} variant="ghost" fullWidth />
    </AppModal>
  );
}
