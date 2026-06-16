import { memo } from 'react';
import { Pressable, View } from 'react-native';
import type { Control, UseFieldArrayRemove } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';

import { AppText, Input } from '@/shared/components';
import {
  formatNumericFieldValue,
  handleIntegerFieldChange,
} from '@/shared/utils/numericInput';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_FREQUENCY_LABELS,
  MAINTENANCE_SCHEDULE_LABELS,
  MAINTENANCE_SCHEDULE_TYPES,
} from '../types/contracts.types';
import type { ContractFormValues } from '../validation/contract.schemas';
import { createStyles } from './MaintenanceChecklistEditor.styles';

interface MaintenanceChecklistItemRowProps {
  control: Control<ContractFormValues>;
  index: number;
  remove: UseFieldArrayRemove;
}

export const MaintenanceChecklistItemRow = memo(function MaintenanceChecklistItemRow({
  control,
  index,
  remove,
}: MaintenanceChecklistItemRowProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const scheduleType = useWatch({
    control,
    name: `maintenanceChecklist.${index}.scheduleType`,
  });

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <AppText variant="bodySmall" color="textSecondary">
          Item {index + 1}
        </AppText>
        <Pressable onPress={() => remove(index)} accessibilityRole="button">
          <AppText variant="caption" color="error">
            Remove
          </AppText>
        </Pressable>
      </View>

      <Controller
        control={control}
        name={`maintenanceChecklist.${index}.title`}
        render={({ field, fieldState }) => (
          <Input
            label="Title"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder="e.g. Washing"
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name={`maintenanceChecklist.${index}.scheduleType`}
        render={({ field }) => (
          <>
            <AppText variant="label">Schedule type</AppText>
            <View style={styles.chips}>
              {MAINTENANCE_SCHEDULE_TYPES.map((type) => {
                const isSelected = field.value === type;

                return (
                  <Pressable
                    key={type}
                    onPress={() => field.onChange(type)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primaryMuted
                          : theme.colors.surface,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText variant="caption" color={isSelected ? 'primary' : 'textPrimary'}>
                      {MAINTENANCE_SCHEDULE_LABELS[type]}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      />

      {scheduleType === 'time' ? (
        <Controller
          control={control}
          name={`maintenanceChecklist.${index}.frequency`}
          render={({ field }) => (
            <>
              <AppText variant="label">Frequency</AppText>
              <View style={styles.chips}>
                {MAINTENANCE_FREQUENCIES.map((frequency) => {
                  const isSelected = field.value === frequency;

                  return (
                    <Pressable
                      key={frequency}
                      onPress={() => field.onChange(frequency)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected
                            ? theme.colors.primaryMuted
                            : theme.colors.surface,
                          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                    >
                      <AppText variant="caption" color={isSelected ? 'primary' : 'textPrimary'}>
                        {MAINTENANCE_FREQUENCY_LABELS[frequency]}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        />
      ) : (
        <Controller
          control={control}
          name={`maintenanceChecklist.${index}.mileageIntervalKm`}
          render={({ field, fieldState }) => (
            <Input
              label="Every (km)"
              value={formatNumericFieldValue(field.value)}
              onChangeText={(text) => handleIntegerFieldChange(text, field.onChange)}
              onBlur={field.onBlur}
              keyboardType="number-pad"
              placeholder="5000"
              error={fieldState.error?.message}
            />
          )}
        />
      )}
    </View>
  );
});
