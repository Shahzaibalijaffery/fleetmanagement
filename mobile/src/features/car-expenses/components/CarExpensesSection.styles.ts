import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginTop: theme.spacing.md,
    },
    sectionHeader: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    addButton: {
      alignSelf: 'flex-start',
    },
    headerActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    totalCard: {
      marginBottom: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    empty: {
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
    },
  });
