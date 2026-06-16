import { useEffect, useState } from 'react';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { AppModal, AppText, Button, Input } from '@/shared/components';
import { odometerInputStringSchema } from '@/shared/validation/field.schemas';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { parseDecimalInput, parseIntegerInput, sanitizeDecimalInput, sanitizeIntegerInput } from '@/shared/utils/numericInput';

import type { MaintenanceChecklistItem } from '../types/contracts.types';

interface CompleteContractMaintenanceValues {
  cost: number;
  currentOdometerKm?: number;
}

interface CompleteContractMaintenanceModalProps {
  visible: boolean;
  item: MaintenanceChecklistItem | null;
  odometerKm: number;
  isSubmitting: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (values: CompleteContractMaintenanceValues) => void;
}

export function CompleteContractMaintenanceModal({
  visible,
  item,
  odometerKm,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: CompleteContractMaintenanceModalProps) {
  const isMileageBased = item?.scheduleType === 'mileage';
  const [costInput, setCostInput] = useState('');
  const [odometerInput, setOdometerInput] = useState(String(odometerKm));
  const [costError, setCostError] = useState<string | undefined>();
  const [odometerError, setOdometerError] = useState<string | undefined>();

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCostInput('');
    setOdometerInput(String(odometerKm));
    setCostError(undefined);
    setOdometerError(undefined);
  }, [visible, item?.id, odometerKm]);

  const handleConfirm = () => {
    const parsedCost = parseDecimalInput(costInput, -1);
    if (parsedCost <= 0) {
      setCostError('Enter a valid cost');
      return;
    }

    let parsedOdometer: number | undefined;
    if (isMileageBased) {
      const odometerResult = odometerInputStringSchema.safeParse(odometerInput);

      if (!odometerResult.success) {
        setOdometerError(odometerResult.error.issues[0]?.message ?? 'Enter a valid odometer');
        return;
      }

      parsedOdometer = parseIntegerInput(odometerInput, odometerKm);
    }

    setCostError(undefined);
    setOdometerError(undefined);
    onConfirm({
      cost: parsedCost,
      currentOdometerKm: parsedOdometer,
    });
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

      <Input
        label="Cost (Rs.)"
        placeholder="0"
        keyboardType="numeric"
        value={costInput}
        onChangeText={(value) => {
          setCostInput(sanitizeDecimalInput(value));
          if (costError) {
            setCostError(undefined);
          }
        }}
        error={costError}
      />

      {isMileageBased ? (
        <Input
          label="Odometer (km)"
          placeholder="0"
          keyboardType="number-pad"
          value={odometerInput}
          onChangeText={(value) => {
            setOdometerInput(sanitizeIntegerInput(value));
            if (odometerError) {
              setOdometerError(undefined);
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
