import { Pressable, View } from 'react-native';

import { AppText, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { Car } from '../types/cars.types';
import { CarStatusBadge } from './CarStatusBadge';
import { createStyles } from './CarCard.styles';

interface CarCardProps {
  car: Car;
  onPress: (carId: string) => void;
}

export function CarCard({ car, onPress }: CarCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable onPress={() => onPress(car.id)} accessibilityRole="button">
      <Card padding="md">
        <View style={styles.header}>
          <AppText variant="heading3">
            {car.brand} {car.model}
          </AppText>
          <CarStatusBadge status={car.status} />
        </View>
        <AppText variant="bodySmall" color="textSecondary" style={styles.meta}>
          {car.year} · {car.registrationNumber}
        </AppText>
        <AppText variant="caption" color="textTertiary">
          {car.city}
        </AppText>
      </Card>
    </Pressable>
  );
}
