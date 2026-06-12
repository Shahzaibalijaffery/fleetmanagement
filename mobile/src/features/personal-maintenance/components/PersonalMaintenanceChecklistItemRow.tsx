import { memo } from 'react';
import { Pressable, View } from 'react-native';
import type { Control, UseFieldArrayRemove } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';

import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_FREQUENCY_LABELS,
  MAINTENANCE_SCHEDULE_LABELS,
  MAINTENANCE_SCHEDULE_TYPES,
} from '@/features/contracts/types/contracts.types';
import { AppText, Input } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { PersonalMaintenanceFormValues } from '../validation/personal-maintenance.schemas';
import { createStyles } from './PersonalMaintenanceEditor.styles';

interface PersonalMaintenanceChecklistItemRowProps {
  control: Control<PersonalMaintenanceFormValues>;
  index: number;
  remove: UseFieldArrayRemove;
}

export const PersonalMaintenanceChecklistItemRow = memo(function PersonalMaintenanceChecklistItemRow({
  control,
  index,
  remove,
}: PersonalMaintenanceChecklistItemRowProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const scheduleType = useWatch({
    control,
    name: `personalMaintenanceChecklist.${index}.scheduleType`,
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
        name={`personalMaintenanceChecklist.${index}.title`}
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
        name={`personalMaintenanceChecklist.${index}.scheduleType`}
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
          name={`personalMaintenanceChecklist.${index}.frequency`}
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
          name={`personalMaintenanceChecklist.${index}.mileageIntervalKm`}
          render={({ field, fieldState }) => (
            <Input
              label="Every (km)"
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
              placeholder="5000"
              error={fieldState.error?.message}
            />
          )}
        />
      )}
    </View>
  );
});
