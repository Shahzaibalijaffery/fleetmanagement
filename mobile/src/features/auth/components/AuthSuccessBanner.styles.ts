import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    banner: {
      backgroundColor: theme.colors.successMuted,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.success,
    },
  });
