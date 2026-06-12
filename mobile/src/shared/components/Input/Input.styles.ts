import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.xs,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.textPrimary,
    },
    input: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 44,
    },
    inputFocused: {
      borderColor: theme.colors.borderFocused,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    error: {
      ...theme.typography.caption,
      color: theme.colors.error,
    },
  });
