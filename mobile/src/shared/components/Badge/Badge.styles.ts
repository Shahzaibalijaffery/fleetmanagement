import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

import type { BadgeSize, BadgeVariant } from './Badge.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      borderRadius: theme.radius.full,
    },
    label: {
      ...theme.typography.caption,
      fontWeight: '600',
    },
  });

export function getSizeStyle(theme: Theme, size: BadgeSize): object {
  return size === 'sm'
    ? {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
      }
    : {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
      };
}

export function getVariantStyle(
  theme: Theme,
  variant: BadgeVariant,
): { container: object; label: object } {
  const { colors } = theme;

  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: colors.primaryMuted },
        label: { color: colors.primary },
      };
    case 'accent':
      return {
        container: { backgroundColor: colors.accentMuted },
        label: { color: colors.accent },
      };
    case 'success':
      return {
        container: { backgroundColor: colors.successMuted },
        label: { color: colors.success },
      };
    case 'error':
      return {
        container: { backgroundColor: colors.errorMuted },
        label: { color: colors.error },
      };
    case 'warning':
      return {
        container: { backgroundColor: colors.warningMuted },
        label: { color: colors.warning },
      };
    case 'neutral':
      return {
        container: { backgroundColor: colors.surfaceElevated },
        label: { color: colors.textSecondary },
      };
  }
}
