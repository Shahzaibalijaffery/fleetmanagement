import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    chip: {
      borderWidth: 1,
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    chipDefault: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    chipSelected: {
      backgroundColor: theme.colors.primaryMuted,
      borderColor: theme.colors.primary,
    },
  });
