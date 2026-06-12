import { View } from 'react-native';

import { AppText, Badge, Button, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { CAR_TYPE_LABELS, type MarketplaceCar } from '../types/marketplace.types';
import { createStyles } from './MarketplaceCarCard.styles';

interface MarketplaceCarCardProps {
  car: MarketplaceCar;
  onRequest?: (carId: string) => void;
  isRequesting?: boolean;
}

export function MarketplaceCarCard({ car, onRequest, isRequesting = false }: MarketplaceCarCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Card padding="md">
      <View style={styles.header}>
        <AppText variant="heading3">
          {car.brand} {car.model}
        </AppText>
        <Badge label={CAR_TYPE_LABELS[car.carType]} variant="primary" size="sm" />
      </View>
      <AppText variant="bodySmall" color="textSecondary" style={styles.meta}>
        {car.year} · {car.city}
      </AppText>
      <View style={styles.footer}>
        <Badge label="Available" variant="success" size="sm" />
        {onRequest ? (
          <Button
            title="Request car"
            onPress={() => onRequest(car.id)}
            loading={isRequesting}
            size="sm"
          />
        ) : null}
      </View>
    </Card>
  );
}
