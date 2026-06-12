import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import {
  CAR_TYPE_LABELS,
  CAR_TYPES,
  MARKETPLACE_RADIUS_KM_OPTIONS,
  MARKETPLACE_RADIUS_LABELS,
  type CarType,
  type MarketplaceRadiusKm,
} from '../types/marketplace.types';
import { createStyles } from './MarketplaceFilters.styles';

interface MarketplaceFiltersProps {
  radiusKm: MarketplaceRadiusKm;
  onRadiusKmChange: (radiusKm: MarketplaceRadiusKm) => void;
  carType?: CarType;
  onCarTypeChange: (carType: CarType | undefined) => void;
  onClearFilters?: () => void;
  hasActiveFilters: boolean;
}

export function MarketplaceFilters({
  radiusKm,
  onRadiusKmChange,
  carType,
  onCarTypeChange,
  onClearFilters,
  hasActiveFilters,
}: MarketplaceFiltersProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <AppText variant="label">Distance</AppText>
        <View style={styles.chips}>
          {MARKETPLACE_RADIUS_KM_OPTIONS.map((option) => {
            const isSelected = radiusKm === option;

            return (
              <Pressable
                key={option}
                onPress={() => onRadiusKmChange(option)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primaryMuted
                      : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <AppText variant="caption" color={isSelected ? 'primary' : 'textPrimary'}>
                  {MARKETPLACE_RADIUS_LABELS[option]}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.filterSection}>
        <AppText variant="label">Car type</AppText>
        <View style={styles.chips}>
          {CAR_TYPES.map((type) => {
            const isSelected = carType === type;

            return (
              <Pressable
                key={type}
                onPress={() => onCarTypeChange(isSelected ? undefined : type)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primaryMuted
                      : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <AppText variant="caption" color={isSelected ? 'primary' : 'textPrimary'}>
                  {CAR_TYPE_LABELS[type]}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {hasActiveFilters && onClearFilters ? (
        <Pressable onPress={onClearFilters} accessibilityRole="button">
          <AppText variant="caption" color="primary">
            Clear filters
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
