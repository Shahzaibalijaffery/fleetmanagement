import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      marginBottom: theme.spacing.sm,
    },
    listHeader: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      gap: theme.spacing.sm,
    },
    listContainer: {
      flex: 1,
    },
    list: {
      paddingBottom: theme.spacing.md,
    },
    separator: {
      height: theme.spacing.xs,
    },
    footer: {
      paddingVertical: theme.spacing.sm,
    },
  });
