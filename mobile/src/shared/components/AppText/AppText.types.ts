import type { TextProps, TextStyle } from 'react-native';

import type { ColorTokens } from '@/shared/theme';

export type AppTextVariant =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

export type AppTextColor = keyof Pick<
  ColorTokens,
  | 'textPrimary'
  | 'textSecondary'
  | 'textTertiary'
  | 'textInverse'
  | 'primary'
  | 'accent'
  | 'error'
  | 'success'
  | 'warning'
>;

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: AppTextColor;
  align?: TextStyle['textAlign'];
}
