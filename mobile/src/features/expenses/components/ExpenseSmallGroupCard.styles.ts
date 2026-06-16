import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      gap: theme.spacing.xs,
    },
    groupCard: {
      backgroundColor: theme.colors.surfaceTint,
      borderColor: theme.colors.primaryMuted,
    },
    groupAccent: {
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
    },
    chevron: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    expandedContainer: {
      overflow: 'hidden',
    },
    measureHidden: {
      position: 'absolute',
      left: 0,
      right: 0,
      opacity: 0,
      zIndex: -1,
    },
    expandedList: {
      gap: theme.spacing.xs,
      paddingLeft: theme.spacing.sm,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.border,
      marginLeft: theme.spacing.sm,
    },
    separator: {
      height: theme.spacing.xs,
    },
  });
