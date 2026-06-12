import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { REQUEST_STATUS_LABELS, REQUEST_STATUSES, type RequestStatus } from '../types/requests.types';
import { createStyles } from './RequestStatusFilter.styles';

interface RequestStatusFilterProps {
  value?: RequestStatus;
  onChange: (status: RequestStatus | undefined) => void;
}

export function RequestStatusFilter({ value, onChange }: RequestStatusFilterProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="label">Status</AppText>
      <View style={styles.chips}>
        <Pressable
          onPress={() => onChange(undefined)}
          style={[
            styles.chip,
            {
              backgroundColor: !value ? theme.colors.primaryMuted : theme.colors.surface,
              borderColor: !value ? theme.colors.primary : theme.colors.border,
            },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: !value }}
        >
          <AppText variant="caption" color={!value ? 'primary' : 'textPrimary'}>
            All
          </AppText>
        </Pressable>
        {REQUEST_STATUSES.map((status) => {
          const isSelected = value === status;

          return (
            <Pressable
              key={status}
              onPress={() => onChange(isSelected ? undefined : status)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.colors.primaryMuted : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <AppText variant="caption" color={isSelected ? 'primary' : 'textPrimary'}>
                {REQUEST_STATUS_LABELS[status]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
