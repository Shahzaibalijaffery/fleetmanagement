import { View } from 'react-native';

import { LoadingSkeleton } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './CarDetailSkeleton.styles';

export function CarDetailSkeleton() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <LoadingSkeleton height={28} width="70%" borderRadius={8} />
      <LoadingSkeleton height={20} width="40%" borderRadius={6} />
      <View style={styles.rows}>
        <LoadingSkeleton height={48} borderRadius={12} />
        <LoadingSkeleton height={48} borderRadius={12} />
        <LoadingSkeleton height={48} borderRadius={12} />
        <LoadingSkeleton height={48} borderRadius={12} />
      </View>
    </View>
  );
}
