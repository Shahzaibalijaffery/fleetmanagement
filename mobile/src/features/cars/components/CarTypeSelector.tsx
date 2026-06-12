import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { CAR_TYPE_LABELS, CAR_TYPES, type CarType } from '../types/cars.types';
import { createStyles } from './CarStatusSelector.styles';

interface CarTypeSelectorProps {
  value: CarType;
  onChange: (carType: CarType) => void;
  error?: string;
}

export function CarTypeSelector({ value, onChange, error }: CarTypeSelectorProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="label">Car type</AppText>
      <View style={styles.options}>
        {CAR_TYPES.map((carType) => {
          const isSelected = value === carType;

          return (
            <Pressable
              key={carType}
              onPress={() => onChange(carType)}
              style={[
                styles.option,
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
                {CAR_TYPE_LABELS[carType]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText variant="caption" color="error">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
