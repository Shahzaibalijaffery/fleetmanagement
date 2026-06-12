import { StyleSheet } from 'react-native';

import type { AccentTone, Theme } from '@/shared/theme';
import { getAccentToneColor } from '@/shared/theme';

import type { CardPadding } from './Card.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pressable: {
      borderRadius: theme.radius.lg,
    },
    pressed: {
      opacity: 0.92,
    },
  });

export function getPadding(theme: Theme, padding: CardPadding): object {
  return { padding: theme.spacing[padding] };
}

export function getShadow(theme: Theme, elevated: boolean): object {
  return elevated ? theme.shadows.card : {};
}

export function getAccentStyle(theme: Theme, tone: AccentTone): object {
  return {
    borderLeftWidth: 3,
    borderLeftColor: getAccentToneColor(theme.colors, tone),
  };
}
