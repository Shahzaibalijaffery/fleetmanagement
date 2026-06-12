import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  name?: string;
  source?: ImageSourcePropType;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
}
