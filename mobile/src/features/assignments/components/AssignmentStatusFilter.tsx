import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { ASSIGNMENT_STATUSES, type AssignmentStatus } from '../types/assignments.types';
import { createStyles } from './AssignmentStatusFilter.styles';

const STATUS_LABELS: Record<AssignmentStatus, string> = {
  active: 'Active',
  ended: 'Ended',
};

interface AssignmentStatusFilterProps {
  value?: AssignmentStatus;
  onChange: (status: AssignmentStatus | undefined) => void;
}

export function AssignmentStatusFilter({ value, onChange }: AssignmentStatusFilterProps) {
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
        {ASSIGNMENT_STATUSES.map((status) => {
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
                {STATUS_LABELS[status]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
