import { forwardRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './Input.styles';
import type { InputProps } from './Input.types';

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, containerStyle, style, onFocus, onBlur, ...rest },
  ref,
) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error ? styles.inputError : undefined,
          style,
        ]}
        placeholderTextColor={theme.colors.textTertiary}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        accessibilityLabel={label}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});
