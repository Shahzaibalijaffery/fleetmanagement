import type { StyleProp, ViewStyle } from 'react-native';

export interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
}
