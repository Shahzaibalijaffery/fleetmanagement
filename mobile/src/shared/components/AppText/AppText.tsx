import { Text } from 'react-native';

import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles, getColorStyle, getVariantStyle } from './AppText.styles';
import type { AppTextProps } from './AppText.types';

export function AppText({
  variant = 'body',
  color = 'textPrimary',
  align,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Text
      style={[
        styles.base,
        getVariantStyle(theme, variant),
        getColorStyle(theme, color),
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
