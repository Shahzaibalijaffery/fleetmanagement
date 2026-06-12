import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    tagline: {
      marginTop: theme.spacing.xs,
    },
    skeleton: {
      marginTop: theme.spacing.xl,
      width: '100%',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
  });
