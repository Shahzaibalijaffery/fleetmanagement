import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginTop: theme.spacing.md,
    },
    sectionTitle: {
      marginBottom: theme.spacing.sm,
    },
    item: {
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    meta: {
      marginTop: theme.spacing.xs,
    },
    odometerRow: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    action: {
      marginTop: theme.spacing.sm,
    },
  });
