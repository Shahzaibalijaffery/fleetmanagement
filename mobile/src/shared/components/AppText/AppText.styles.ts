import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

import type { AppTextColor, AppTextVariant } from './AppText.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      ...theme.typography.body,
    },
  });

export function getVariantStyle(
  theme: Theme,
  variant: AppTextVariant,
): object {
  return theme.typography[variant];
}

export function getColorStyle(theme: Theme, color: AppTextColor): object {
  return { color: theme.colors[color] };
}
