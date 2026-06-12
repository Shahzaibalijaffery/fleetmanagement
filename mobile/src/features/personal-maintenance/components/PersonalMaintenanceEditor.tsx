import { View } from 'react-native';
import type { Control } from 'react-hook-form';
import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
} from 'react-hook-form';
import { Controller, useFormState } from 'react-hook-form';

import {
  DEFAULT_MAINTENANCE_PRESETS,
  type MaintenanceChecklistItemInput,
} from '@/features/contracts/types/contracts.types';
import { AppText, Button, Input } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { PersonalMaintenanceFormValues } from '../validation/personal-maintenance.schemas';
import { PersonalMaintenanceChecklistItemRow } from './PersonalMaintenanceChecklistItemRow';
import { createStyles } from './PersonalMaintenanceEditor.styles';

interface PersonalMaintenanceEditorProps {
  control: Control<PersonalMaintenanceFormValues>;
  fields: FieldArrayWithId<PersonalMaintenanceFormValues, 'personalMaintenanceChecklist', 'id'>[];
  append: UseFieldArrayAppend<PersonalMaintenanceFormValues, 'personalMaintenanceChecklist'>;
  replace: UseFieldArrayReplace<PersonalMaintenanceFormValues, 'personalMaintenanceChecklist'>;
  remove: UseFieldArrayRemove;
}

function createBlankItem(): MaintenanceChecklistItemInput {
  return {
    title: '',
    scheduleType: 'time',
    frequency: 'weekly',
  };
}

export function PersonalMaintenanceEditor({
  control,
  fields,
  append,
  replace,
  remove,
}: PersonalMaintenanceEditorProps) {
  const styles = useThemedStyles(createStyles);
  const { errors } = useFormState({
    control,
    name: ['personalMaintenanceChecklist', 'personalInitialOdometerKm'],
  });

  return (
    <View style={styles.section}>
      <AppText variant="label">Running cost items</AppText>
      <AppText variant="caption" color="textSecondary">
        Track washing, oil change, and service on a repeating schedule — separate from repair bills.
      </AppText>

      <Controller
        control={control}
        name="personalInitialOdometerKm"
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
            error={fieldState.error?.message ?? errors.personalInitialOdometerKm?.message}
          />
        )}
      />

      {fields.map((field, index) => (
        <PersonalMaintenanceChecklistItemRow
          key={field.id}
          control={control}
          index={index}
          remove={remove}
        />
      ))}

      {errors.personalMaintenanceChecklist?.message ? (
        <AppText variant="caption" color="error">
          {errors.personalMaintenanceChecklist.message}
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
