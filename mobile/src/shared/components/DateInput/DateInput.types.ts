import type { StyleProp, ViewStyle } from 'react-native';

export interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}
