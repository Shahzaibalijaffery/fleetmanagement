import { Pressable, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';

import { AppText, Input } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { CreateExpenseFormValues } from '../validation/car-expense.schemas';
import { createStyles } from './ExpenseItemFields.styles';

interface ExpenseItemFieldsProps {
  index: number;
  control: Control<CreateExpenseFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function ExpenseItemFields({
  index,
  control,
  onRemove,
  canRemove,
}: ExpenseItemFieldsProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <AppText variant="caption" color="textSecondary">
          Item {index + 1}
        </AppText>
        {canRemove ? (
          <Pressable onPress={onRemove} accessibilityRole="button">
            <AppText variant="caption" color="error">
              Remove
            </AppText>
          </Pressable>
        ) : null}
      </View>

      <Controller
        control={control}
        name={`items.${index}.title`}
        render={({ field, fieldState }) => (
          <Input
            label="Title"
            placeholder="Brake pads, battery, etc."
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name={`items.${index}.amount`}
        render={({ field, fieldState }) => (
          <Input
            label="Amount"
            value={field.value === 0 ? '' : String(field.value)}
            onChangeText={(text) => {
              const parsed = Number(text);
              field.onChange(Number.isNaN(parsed) ? 0 : parsed);
            }}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="decimal-pad"
          />
        )}
      />
    </View>
  );
}
