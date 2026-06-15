import { useEffect, useState } from 'react';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import type { PersonalMaintenanceChecklistItem } from '@/features/cars/types/cars.types';
import { parseOdometerInput } from '@/features/contracts/utils/parseOdometerInput';
import { AppModal, AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import {
  DUPLICATE_MILEAGE_COMPLETION_MESSAGE,
  isDuplicateMileageCompletion,
} from '../utils/duplicateMaintenanceCompletion';

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
  const [cost, setCost] = useState('');
  const [odometer, setOdometer] = useState('');
  const [costError, setCostError] = useState<string | undefined>();
  const [odometerError, setOdometerError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  const isMileageBased = item?.scheduleType === 'mileage';

  useEffect(() => {
    if (visible) {
      setCost('');
      setOdometer(String(odometerKm));
      setCostError(undefined);
      setOdometerError(undefined);
      setFormError(undefined);
    }
  }, [visible, item?.id, odometerKm]);

  const handleConfirm = () => {
    const trimmedCost = cost.trim();
    const trimmedOdometer = odometer.trim();
    let hasError = false;

    setFormError(undefined);

    if (trimmedCost === '') {
      setCostError('Cost is required');
      hasError = true;
    } else {
      const parsedCost = Number(trimmedCost);
      if (Number.isNaN(parsedCost) || parsedCost < 0) {
        setCostError('Enter a valid cost');
        hasError = true;
      } else {
        setCostError(undefined);
      }
    }

    if (isMileageBased) {
      if (trimmedOdometer === '') {
        setOdometerError('Odometer is required');
        hasError = true;
      } else {
        const parsedOdometer = Number(trimmedOdometer);
        if (Number.isNaN(parsedOdometer) || parsedOdometer < 0) {
          setOdometerError('Enter a valid odometer reading');
          hasError = true;
        } else {
          setOdometerError(undefined);
        }
      }
    }

    if (hasError || !item) {
      return;
    }

    const values: CompleteMaintenanceValues = {
      cost: Number(cost.trim()),
    };

    if (isMileageBased) {
      values.odometerKm = parseOdometerInput(odometer, odometerKm);

      if (isDuplicateMileageCompletion(item, values.odometerKm)) {
        setFormError(DUPLICATE_MILEAGE_COMPLETION_MESSAGE);
        return;
      }
    }

    onConfirm(values);
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

      <Input
        label="Cost (Rs.)"
        placeholder="0"
        keyboardType="numeric"
        value={cost}
        onChangeText={(value) => {
          setCost(value);
          if (costError) {
            setCostError(undefined);
          }
          if (formError) {
            setFormError(undefined);
          }
        }}
        error={costError}
      />

      {isMileageBased ? (
        <Input
          label="Odometer (km)"
          placeholder="0"
          keyboardType="number-pad"
          value={odometer}
          onChangeText={(value) => {
            setOdometer(value);
            if (odometerError) {
              setOdometerError(undefined);
            }
            if (formError) {
              setFormError(undefined);
            }
          }}
          error={odometerError}
        />
      ) : null}

      <Button title="Confirm" onPress={handleConfirm} loading={isSubmitting} fullWidth />
      <Button title="Cancel" onPress={onClose} variant="ghost" fullWidth />
    </AppModal>
  );
}
