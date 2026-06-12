import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { CarStatus } from '../types/cars.types';
import { createStyles } from './CarStatusSelector.styles';

interface CarStatusSelectorProps {
  value: CarStatus;
  onChange: (status: CarStatus) => void;
  allowedStatuses: CarStatus[];
  error?: string;
  disabled?: boolean;
}

const STATUS_LABELS: Record<CarStatus, string> = {
  available: 'Available',
  assigned: 'Assigned',
  inactive: 'Inactive',
  personal_use: 'Personal use',
};

export function CarStatusSelector({
  value,
  onChange,
  allowedStatuses,
  error,
  disabled = false,
}: CarStatusSelectorProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="label">Status</AppText>
      <View style={styles.options}>
        {allowedStatuses.map((status) => {
          const isSelected = value === status;

          return (
            <Pressable
              key={status}
              onPress={() => onChange(status)}
              disabled={disabled}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primaryMuted
                    : theme.colors.surface,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
            >
              <AppText
                variant="caption"
                color={isSelected ? 'primary' : 'textPrimary'}
              >
                {STATUS_LABELS[status]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText variant="caption" color="error">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
