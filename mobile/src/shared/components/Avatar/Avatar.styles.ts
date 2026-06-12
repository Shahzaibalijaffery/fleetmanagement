import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme';

import type { AvatarSize } from './Avatar.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: theme.colors.primaryMuted,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    initials: {
      ...theme.typography.label,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

export function getSize(theme: Theme, size: AvatarSize): {
  container: object;
  fontSize: number;
} {
  const sizes = {
    sm: { dimension: 32, fontSize: theme.typography.caption.fontSize },
    md: { dimension: 44, fontSize: theme.typography.label.fontSize },
    lg: { dimension: 64, fontSize: theme.typography.heading3.fontSize },
  };

  const { dimension, fontSize } = sizes[size];

  return {
    container: {
      width: dimension,
      height: dimension,
      borderRadius: theme.radius.full,
    },
    fontSize,
  };
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}
