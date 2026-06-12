import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    rows: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
  });
