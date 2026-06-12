import { View } from 'react-native';

import { AppText, Badge, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { CAR_TYPE_LABELS, type MarketplaceDriver } from '../types/marketplace.types';
import { createStyles } from './MarketplaceDriverCard.styles';

interface MarketplaceDriverCardProps {
  driver: MarketplaceDriver;
}

export function MarketplaceDriverCard({ driver }: MarketplaceDriverCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Card padding="md">
      <View style={styles.header}>
        <AppText variant="heading3">{driver.name}</AppText>
        <Badge label="Available" variant="success" size="sm" />
      </View>
      <AppText variant="bodySmall" color="textSecondary" style={styles.meta}>
        {driver.city ?? 'City not set'}
        {driver.experience != null ? ` · ${driver.experience} yrs experience` : ''}
      </AppText>
      {driver.carTypes.length > 0 ? (
        <View style={styles.types}>
          {driver.carTypes.map((type) => (
            <Badge key={type} label={CAR_TYPE_LABELS[type]} variant="neutral" size="sm" />
          ))}
        </View>
      ) : (
        <AppText variant="caption" color="textTertiary">
          No car types listed
        </AppText>
      )}
    </Card>
  );
}
