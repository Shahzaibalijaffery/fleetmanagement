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
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    icon: {
      fontSize: 28,
    },
    title: {
      ...theme.typography.heading3,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    message: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    action: {
      marginTop: theme.spacing.md,
      alignSelf: 'stretch',
    },
  });
