import { Pressable, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles, getAccentStyle, getPadding, getShadow } from './Card.styles';
import type { CardProps } from './Card.types';

export function Card({
  children,
  padding = 'md',
  elevated = true,
  accentTone,
  style,
  onPress,
  ...rest
}: CardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const contentStyle = [
    styles.card,
    getPadding(theme, padding),
    getShadow(theme, elevated),
    accentTone ? getAccentStyle(theme, accentTone) : undefined,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        {...rest}
      >
        <View style={contentStyle}>{children}</View>
      </Pressable>
    );
  }

  return <View style={contentStyle}>{children}</View>;
}
