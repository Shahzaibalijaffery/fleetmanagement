import { View } from 'react-native';

import { LoadingSkeleton } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './DashboardSkeleton.styles';

export function DashboardSkeleton() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <LoadingSkeleton height={88} borderRadius={12} style={styles.half} />
        <LoadingSkeleton height={88} borderRadius={12} style={styles.half} />
        <LoadingSkeleton height={88} borderRadius={12} style={styles.half} />
        <LoadingSkeleton height={88} borderRadius={12} style={styles.half} />
      </View>
    </View>
  );
}
