import { Image, Text, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles, getInitials, getSize } from './Avatar.styles';
import type { AvatarProps } from './Avatar.types';

export function Avatar({ name, source, size = 'md', style }: AvatarProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const sizeStyle = getSize(theme, size);
  const initials = name ? getInitials(name) : '?';

  return (
    <View
      style={[styles.container, sizeStyle.container, style]}
      accessibilityRole="image"
      accessibilityLabel={name ?? 'Avatar'}
    >
      {source ? (
        <Image source={source} style={styles.image} resizeMode="cover" />
      ) : (
        <Text style={[styles.initials, { fontSize: sizeStyle.fontSize }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}
