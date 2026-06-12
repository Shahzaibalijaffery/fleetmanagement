import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    header: {
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    backButton: {
      alignSelf: 'flex-start',
      minHeight: 44,
      justifyContent: 'center',
      marginLeft: -theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
    },
    subtitle: {
      marginTop: theme.spacing.xs,
    },
    form: {
      gap: theme.spacing.md,
    },
    footer: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
  });
