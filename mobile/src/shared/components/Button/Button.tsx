import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles, getSizeStyle, getVariantStyle } from './Button.styles';
import type { ButtonProps } from './Button.types';

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const variantStyles = getVariantStyle(theme, variant);
  const sizeStyle = getSizeStyle(theme, size);

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.pressable,
        variantStyles.container,
        variantStyles.border,
        sizeStyle,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.label.color} />
      ) : (
        <Text style={[styles.label, variantStyles.label]}>{title}</Text>
      )}
    </Pressable>
  );
}
