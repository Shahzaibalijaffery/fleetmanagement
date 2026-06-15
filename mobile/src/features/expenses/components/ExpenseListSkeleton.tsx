import { View } from 'react-native';

import { LoadingSkeleton } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './ExpenseListSkeleton.styles';

interface ExpenseListSkeletonProps {
  count?: number;
}

export function ExpenseListSkeleton({ count = 5 }: ExpenseListSkeletonProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.card}>
          <LoadingSkeleton height={20} width="55%" borderRadius={6} />
          <LoadingSkeleton height={14} width="70%" borderRadius={6} />
          <LoadingSkeleton height={12} width="40%" borderRadius={6} />
        </View>
      ))}
    </View>
  );
}
