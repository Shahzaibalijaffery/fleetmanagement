import type { StyleProp, ViewStyle } from 'react-native';

export interface LoadingSkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  count?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}
