import { Text, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles, getSizeStyle, getVariantStyle } from './Badge.styles';
import type { BadgeProps } from './Badge.types';

export function Badge({ label, variant = 'neutral', size = 'md' }: BadgeProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const variantStyles = getVariantStyle(theme, variant);
  const sizeStyle = getSizeStyle(theme, size);

  return (
    <View
      style={[styles.badge, variantStyles.container, sizeStyle]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={[styles.label, variantStyles.label]}>{label}</Text>
    </View>
  );
}
