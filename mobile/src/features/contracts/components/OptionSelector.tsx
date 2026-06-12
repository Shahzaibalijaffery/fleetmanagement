import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './OptionSelector.styles';

interface OptionSelectorProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
  error?: string;
}

export function OptionSelector<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
  error,
}: OptionSelectorProps<T>) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="label">{label}</AppText>
      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = value === option;

          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
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
                {labels[option]}
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
