import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    screenContent: {
      flex: 1,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    listContainer: {
      flex: 1,
    },
    list: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    separator: {
      height: theme.spacing.sm,
    },
    footer: {
      marginTop: theme.spacing.sm,
    },
  });
