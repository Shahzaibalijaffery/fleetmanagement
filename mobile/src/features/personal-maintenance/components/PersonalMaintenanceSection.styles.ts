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
    sectionTitle: {
      marginBottom: theme.spacing.xs,
    },
    editButton: {
      alignSelf: 'flex-start',
    },
    odometerRow: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
  });
