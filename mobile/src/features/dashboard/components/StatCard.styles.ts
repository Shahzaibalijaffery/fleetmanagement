import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      minWidth: '46%',
    },
    content: {
      gap: theme.spacing.xs,
    },
    value: {
      marginVertical: theme.spacing.xs,
    },
  });
