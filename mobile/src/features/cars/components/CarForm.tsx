import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { AppText, Button, Input } from '@/shared/components';
import {
  formatNumericFieldValue,
  handleIntegerFieldChange,
} from '@/shared/utils/numericInput';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { Car, CarStatus } from '../types/cars.types';
import { carFormSchema, type CarFormValues } from '../validation/car.schemas';
import { CarStatusSelector } from './CarStatusSelector';
import { CarTypeSelector } from './CarTypeSelector';
import { createStyles } from './CarForm.styles';

interface CarFormProps {
  initialCar?: Car;
  allowedStatuses: CarStatus[];
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: CarFormValues) => void;
}

export function CarForm({
  initialCar,
  allowedStatuses,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: CarFormProps) {
  const styles = useThemedStyles(createStyles);
  const isAssigned = initialCar?.status === 'assigned';

  const { control, handleSubmit, reset, watch, setValue } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    mode: 'onBlur',
    defaultValues: {
      brand: initialCar?.brand ?? '',
      model: initialCar?.model ?? '',
      year: initialCar?.year ?? new Date().getFullYear(),
      registrationNumber: initialCar?.registrationNumber ?? '',
      city: initialCar?.city ?? '',
      carType: initialCar?.carType ?? 'sedan',
      status: initialCar?.status ?? 'available',
    },
  });

  useEffect(() => {
    if (initialCar) {
      reset({
        brand: initialCar.brand,
        model: initialCar.model,
        year: initialCar.year,
        registrationNumber: initialCar.registrationNumber,
        city: initialCar.city,
        carType: initialCar.carType,
        status: initialCar.status,
      });
    }
  }, [initialCar, reset]);

  const status = watch('status') ?? 'available';

  return (
    <View style={styles.form}>
      {errorMessage ? <AuthErrorBanner message={errorMessage} /> : null}

      {isAssigned ? (
        <AppText variant="caption" color="textSecondary">
          This car is assigned. Status cannot be changed until it is unassigned.
        </AppText>
      ) : null}

      <Controller
        control={control}
        name="brand"
        render={({ field, fieldState }) => (
          <Input
            label="Brand"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="model"
        render={({ field, fieldState }) => (
          <Input
            label="Model"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="year"
        render={({ field, fieldState }) => (
          <Input
            label="Year"
            value={formatNumericFieldValue(field.value)}
            onChangeText={(text) => handleIntegerFieldChange(text, (value) => field.onChange(value ?? 0))}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="number-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="registrationNumber"
        render={({ field, fieldState }) => (
          <Input
            label="Registration number"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            autoCapitalize="characters"
          />
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({ field, fieldState }) => (
          <Input
            label="City"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="carType"
        render={({ field, fieldState }) => (
          <CarTypeSelector
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <CarStatusSelector
        value={status}
        onChange={(next) => setValue('status', next, { shouldValidate: true })}
        allowedStatuses={allowedStatuses}
        disabled={isAssigned}
      />

      <Button
        title={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        fullWidth
      />
    </View>
  );
}
