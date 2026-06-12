import type { ReactNode } from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

export interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}
