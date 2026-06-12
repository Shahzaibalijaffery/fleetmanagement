import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.errorMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    icon: {
      fontSize: 28,
    },
    message: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    retry: {
      marginTop: theme.spacing.md,
      alignSelf: 'stretch',
    },
  });
