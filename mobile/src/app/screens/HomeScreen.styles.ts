import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    hero: {
      backgroundColor: theme.colors.surfaceTint,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.primaryMuted,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flex: 1,
      flexWrap: 'wrap',
    },
    welcomeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    welcomeText: {
      flex: 1,
    },
  });
