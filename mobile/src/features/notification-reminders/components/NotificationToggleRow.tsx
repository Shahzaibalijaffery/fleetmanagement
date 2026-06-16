import { Switch, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './NotificationToggleRow.styles';

interface NotificationToggleRowProps {
  label: string;
  value: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  onValueChange: (value: boolean) => void;
}

export function NotificationToggleRow({
  label,
  value,
  disabled = false,
  accessibilityLabel,
  onValueChange,
}: NotificationToggleRowProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <AppText variant="caption" color="textSecondary" style={styles.label}>
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: theme.colors.border, true: theme.colors.primaryMuted }}
        thumbColor={value ? theme.colors.primary : theme.colors.surface}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}
