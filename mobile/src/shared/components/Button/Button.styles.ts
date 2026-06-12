import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import type { Theme } from '@/shared/theme';

import type { ButtonSize, ButtonVariant } from './Button.types';

const MIN_TOUCH_TARGET = 44;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    pressable: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
      minHeight: MIN_TOUCH_TARGET,
    },
    fullWidth: {
      alignSelf: 'stretch',
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.5,
    },
    label: {
      ...theme.typography.label,
    },
  });

export function getSizeStyle(theme: Theme, size: ButtonSize): object {
  const padding = {
    sm: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
    md: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md },
    lg: { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md },
  };
  return padding[size];
}

export function getVariantStyle(theme: Theme, variant: ButtonVariant): {
  container: ViewStyle;
  label: TextStyle;
  border?: ViewStyle;
} {
  const { colors } = theme;

  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: colors.primary },
        label: { color: colors.onPrimary },
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.primaryMuted },
        label: { color: colors.primary },
      };
    case 'outline':
      return {
        container: { backgroundColor: 'transparent' },
        border: { borderWidth: 1, borderColor: colors.border },
        label: { color: colors.textPrimary },
      };
    case 'danger':
      return {
        container: { backgroundColor: colors.error },
        label: { color: colors.onError },
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' },
        label: { color: colors.primary },
      };
  }
}
