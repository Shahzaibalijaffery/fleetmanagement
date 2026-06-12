import { Text, View } from 'react-native';

import { Button } from '@/shared/components/Button';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './ErrorState.styles';
import type { ErrorStateProps } from './ErrorState.types';

export function ErrorState({
  message,
  onRetry,
  retryLabel = 'Try again',
  style,
}: ErrorStateProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, style]} accessibilityRole="alert">
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      <Button
        title={retryLabel}
        onPress={onRetry}
        variant="outline"
        style={styles.retry}
        fullWidth
      />
    </View>
  );
}
