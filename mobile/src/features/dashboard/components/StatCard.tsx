import { View } from 'react-native';

import { AppText, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { AccentTone } from '@/shared/theme';

import { createStyles } from './StatCard.styles';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: AccentTone;
}

export function StatCard({ label, value, hint, tone = 'primary' }: StatCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Card padding="md" accentTone={tone} style={styles.card}>
      <View style={styles.content}>
        <AppText variant="caption" color="textSecondary">
          {label}
        </AppText>
        <AppText variant="heading2" style={styles.value}>
          {value}
        </AppText>
        {hint ? (
          <AppText variant="caption" color="textTertiary">
            {hint}
          </AppText>
        ) : null}
      </View>
    </Card>
  );
}
