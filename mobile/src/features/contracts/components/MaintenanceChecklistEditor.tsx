import { View } from 'react-native';
import type { Control } from 'react-hook-form';
import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
} from 'react-hook-form';
import { Controller, useFormState } from 'react-hook-form';

import { AppText, Button, Input } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import {
  DEFAULT_MAINTENANCE_PRESETS,
  type MaintenanceChecklistItemInput,
} from '../types/contracts.types';
import type { ContractFormValues } from '../validation/contract.schemas';
import { MaintenanceChecklistItemRow } from './MaintenanceChecklistItemRow';
import { createStyles } from './MaintenanceChecklistEditor.styles';

interface MaintenanceChecklistEditorProps {
  control: Control<ContractFormValues>;
  fields: FieldArrayWithId<ContractFormValues, 'maintenanceChecklist', 'id'>[];
  append: UseFieldArrayAppend<ContractFormValues, 'maintenanceChecklist'>;
  replace: UseFieldArrayReplace<ContractFormValues, 'maintenanceChecklist'>;
  remove: UseFieldArrayRemove;
}

function createBlankItem(): MaintenanceChecklistItemInput {
  return {
    title: '',
    scheduleType: 'time',
    frequency: 'weekly',
  };
}

export function MaintenanceChecklistEditor({
  control,
  fields,
  append,
  replace,
  remove,
}: MaintenanceChecklistEditorProps) {
  const styles = useThemedStyles(createStyles);
  const { errors } = useFormState({
    control,
    name: ['maintenanceChecklist', 'initialOdometerKm'],
  });

  return (
    <View style={styles.section}>
      <AppText variant="label">Maintenance checklist</AppText>
      <AppText variant="caption" color="textSecondary">
        Schedule items apply only between the contract start and end dates.
      </AppText>

      <Controller
        control={control}
        name="initialOdometerKm"
        render={({ field, fieldState }) => (
          <Input
            label="Initial odometer (km)"
            value={field.value != null ? String(field.value) : ''}
            onChangeText={(text) => {
              if (text === '') {
                field.onChange(undefined);
                return;
              }
              const parsed = Number(text);
              if (!Number.isNaN(parsed)) {
                field.onChange(parsed);
              }
            }}
            onBlur={field.onBlur}
            keyboardType="number-pad"
            placeholder="Required for mileage-based items"
            error={fieldState.error?.message ?? errors.initialOdometerKm?.message}
          />
        )}
      />

      {fields.map((field, index) => (
        <MaintenanceChecklistItemRow
          key={field.id}
          control={control}
          index={index}
          remove={remove}
        />
      ))}

      {errors.maintenanceChecklist?.message ? (
        <AppText variant="caption" color="error">
          {errors.maintenanceChecklist.message}
        </AppText>
      ) : null}

      <View style={styles.actions}>
        <Button
          title="Add item"
          onPress={() => append(createBlankItem())}
          size="sm"
          variant="outline"
        />
        <Button
          title="Load defaults"
          onPress={() => replace(DEFAULT_MAINTENANCE_PRESETS)}
          size="sm"
          variant="outline"
        />
      </View>
    </View>
  );
}
