import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    sectionCard: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: 0,
      overflow: 'hidden',
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.xs,
      paddingBottom: theme.spacing.sm,
    },
    sectionLabel: {
      fontWeight: '600',
      letterSpacing: 0.6,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.md,
    },
    rowPressed: {
      backgroundColor: theme.colors.primaryMuted,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    rowContent: {
      flex: 1,
      gap: 2,
    },
    chevron: {
      width: 20,
      textAlign: 'right',
    },
  });
