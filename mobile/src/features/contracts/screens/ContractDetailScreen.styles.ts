import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    subtitle: {
      marginBottom: theme.spacing.md,
    },
    section: {
      marginTop: theme.spacing.md,
    },
    sectionTitle: {
      marginBottom: theme.spacing.sm,
    },
    row: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    action: {
      marginTop: theme.spacing.lg,
    },
  });
