import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      minHeight: 44,
    },
    backButton: {
      minWidth: 44,
      minHeight: 44,
      justifyContent: 'center',
      marginLeft: -theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
    },
    titleArea: {
      flex: 1,
    },
    rightArea: {
      minWidth: 44,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    subtitle: {
      marginTop: theme.spacing.xs,
    },
  });
