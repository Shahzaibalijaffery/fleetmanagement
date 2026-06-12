import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './LoadingSkeleton.styles';
import type { LoadingSkeletonProps } from './LoadingSkeleton.types';

interface SkeletonBoneProps {
  width: LoadingSkeletonProps['width'];
  height: LoadingSkeletonProps['height'];
  borderRadius?: number;
}

function SkeletonBone({ width, height, borderRadius }: SkeletonBoneProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.skeleton, theme.colors.skeletonHighlight],
  });

  return (
    <View
      style={[
        styles.bone,
        {
          width: width ?? '100%',
          height: height ?? 16,
          borderRadius: borderRadius ?? theme.radius.sm,
          backgroundColor: theme.colors.skeleton,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      <Animated.View style={[styles.shimmer, { backgroundColor }]} />
    </View>
  );
}

export function LoadingSkeleton({
  width = '100%',
  height = 16,
  borderRadius,
  count = 1,
  gap,
  style,
}: LoadingSkeletonProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const listGap = gap ?? theme.spacing.sm;

  if (count <= 1) {
    return (
      <View style={style}>
        <SkeletonBone width={width} height={height} borderRadius={borderRadius} />
      </View>
    );
  }

  return (
    <View style={[styles.list, { gap: listGap }, style]}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonBone
          key={index}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      ))}
    </View>
  );
}
