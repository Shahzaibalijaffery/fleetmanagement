import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
