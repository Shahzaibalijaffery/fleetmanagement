import { View } from 'react-native';

import { LoadingSkeleton } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './ProfileFormSkeleton.styles';

export function ProfileFormSkeleton() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <LoadingSkeleton height={48} borderRadius={12} />
      <LoadingSkeleton height={48} borderRadius={12} />
      <LoadingSkeleton height={48} borderRadius={12} />
      <LoadingSkeleton height={48} borderRadius={12} />
      <LoadingSkeleton height={48} borderRadius={12} />
    </View>
  );
}
