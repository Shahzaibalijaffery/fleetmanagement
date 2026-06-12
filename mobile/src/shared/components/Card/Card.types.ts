import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import type { AccentTone, Spacing } from '@/shared/theme';

export type CardPadding = keyof Spacing;

export interface CardProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  padding?: CardPadding;
  elevated?: boolean;
  accentTone?: AccentTone;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
