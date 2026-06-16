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
    field: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 44,
      justifyContent: 'center',
    },
    fieldError: {
      borderColor: theme.colors.error,
    },
    value: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    placeholder: {
      color: theme.colors.textTertiary,
    },
    error: {
      ...theme.typography.caption,
      color: theme.colors.error,
    },
    pickerActions: {
      alignItems: 'flex-end',
      marginTop: theme.spacing.xs,
    },
    doneLabel: {
      ...theme.typography.label,
      color: theme.colors.primary,
    },
  });
