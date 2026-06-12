import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    row: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    assignment: {
      marginTop: theme.spacing.md,
    },
    assignmentLabel: {
      marginBottom: theme.spacing.xs,
    },
    action: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    hint: {
      marginTop: theme.spacing.sm,
      textAlign: 'center',
    },
  });
