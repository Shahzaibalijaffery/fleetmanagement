import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import { dateInputToDate, dateToInputValue } from '@/shared/utils/dateInput';
import { formatExpenseDate } from '@/shared/utils/formatExpenseDate';

import { createStyles } from './DateInput.styles';
import type { DateInputProps } from './DateInput.types';

export function DateInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  containerStyle,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
}: DateInputProps) {
  const styles = useThemedStyles(createStyles);
  const [showPicker, setShowPicker] = useState(false);
  const displayValue = value ? formatExpenseDate(value) : '';

  const handleOpen = () => {
    setShowPicker(true);
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed') {
      onBlur?.();
      return;
    }

    if (selectedDate) {
      onChange(dateToInputValue(selectedDate));
      onBlur?.();
    }
  };

  const handleDone = () => {
    setShowPicker(false);
    onBlur?.();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={handleOpen}
        style={[styles.field, error ? styles.fieldError : undefined]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={[styles.value, !displayValue && styles.placeholder]}>
          {displayValue || placeholder}
        </Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {showPicker ? (
        <DateTimePicker
          value={dateInputToDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      ) : null}

      {Platform.OS === 'ios' && showPicker ? (
        <Pressable onPress={handleDone} style={styles.pickerActions} accessibilityRole="button">
          <Text style={styles.doneLabel}>Done</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
