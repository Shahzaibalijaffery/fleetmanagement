import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    list: {
      gap: theme.spacing.sm,
    },
    bone: {
      overflow: 'hidden',
    },
    shimmer: {
      ...StyleSheet.absoluteFill,
    },
  });
