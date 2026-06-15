import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './MaintenanceOptionChips.styles';

interface MaintenanceOptionChipsProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: T;
  getLabel: (value: T) => string;
  onSelect: (value: T) => void;
}

export function MaintenanceOptionChips<T extends string>({
  label,
  options,
  selected,
  getLabel,
  onSelect,
}: MaintenanceOptionChipsProps<T>) {
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <AppText variant="label">{label}</AppText>
      <View style={styles.chips}>
        {options.map((value) => {
          const isSelected = selected === value;

          return (
            <Pressable
              key={value}
              onPress={() => onSelect(value)}
              style={[styles.chip, isSelected ? styles.chipSelected : styles.chipDefault]}
            >
              <AppText variant="caption" color={isSelected ? 'primary' : 'textPrimary'}>
                {getLabel(value)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}
