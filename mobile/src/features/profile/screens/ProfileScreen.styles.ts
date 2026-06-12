import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    signOut: {
      marginTop: theme.spacing.xl,
    },
  });
