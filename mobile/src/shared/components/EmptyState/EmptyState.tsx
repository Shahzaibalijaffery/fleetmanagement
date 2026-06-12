import { Text, View } from 'react-native';

import { Button } from '@/shared/components/Button';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, style]} accessibilityRole="text">
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>📭</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.action}
          fullWidth
        />
      ) : null}
    </View>
  );
}
