import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    pressable: {
      marginBottom: theme.spacing.sm,
    },
    pressed: {
      opacity: 0.85,
    },
    card: {
      gap: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
    },
    headerText: {
      flex: 1,
      minWidth: 0,
      gap: theme.spacing.xs,
    },
    visitTitle: {
      marginTop: theme.spacing.xs,
    },
    totalBlock: {
      flexShrink: 0,
      alignItems: 'flex-end',
      gap: theme.spacing.xs,
    },
    itemsBlock: {
      backgroundColor: theme.colors.surfaceTint,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    itemRowLast: {
      borderBottomWidth: 0,
      paddingBottom: 0,
    },
    itemTitle: {
      flex: 1,
      minWidth: 0,
    },
    itemAmount: {
      flexShrink: 0,
      textAlign: 'right',
    },
    moreItems: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.xs,
    },
  });
