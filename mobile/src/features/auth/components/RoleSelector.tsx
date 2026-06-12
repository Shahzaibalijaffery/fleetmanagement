import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { UserRole } from '../types/auth.types';
import { createStyles } from './RoleSelector.styles';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  error?: string;
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'driver', label: 'Driver' },
];

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="label">I am a</AppText>
      <View style={styles.options}>
        {ROLES.map((role) => {
          const isSelected = value === role.value;

          return (
            <Pressable
              key={role.value}
              onPress={() => onChange(role.value)}
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
              accessibilityState={{ selected: isSelected }}
            >
              <AppText
                variant="label"
                color={isSelected ? 'primary' : 'textPrimary'}
              >
                {role.label}
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
