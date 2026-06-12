import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    itemsTitle: {
      marginBottom: theme.spacing.sm,
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
    itemContent: {
      flex: 1,
      minWidth: 0,
      gap: theme.spacing.xs,
    },
    itemTitle: {
      flexShrink: 1,
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flexShrink: 0,
      paddingTop: theme.spacing.xs,
    },
    form: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    deleteVisit: {
      marginBottom: theme.spacing.lg,
    },
  });
