import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.md,
    },
    amountCard: {
      gap: theme.spacing.xs,
    },
    actions: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  });
