import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    rowHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
  });
