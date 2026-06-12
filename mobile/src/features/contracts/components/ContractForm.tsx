import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { AppText, Button, Input } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import type { Contract } from '../types/contracts.types';
import {
  CONTRACT_MODE_LABELS,
  CONTRACT_MODES,
  DEFAULT_MAINTENANCE_PRESETS,
  PAYMENT_FREQUENCIES,
  PAYMENT_FREQUENCY_LABELS,
  RESPONSIBILITY_LABELS,
  RESPONSIBILITY_PARTIES,
} from '../types/contracts.types';
import { contractFormSchema, type ContractFormValues } from '../validation/contract.schemas';
import { MaintenanceChecklistEditor } from './MaintenanceChecklistEditor';
import { OptionSelector } from './OptionSelector';
import { createStyles } from './ContractForm.styles';

interface ContractFormProps {
  initialContract?: Contract;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: ContractFormValues) => void;
}

function formatDate(value: string): string {
  return value.slice(0, 10);
}

function mapContractChecklist(contract: Contract): ContractFormValues['maintenanceChecklist'] {
  return contract.maintenanceChecklist.map((item) => ({
    title: item.title,
    scheduleType: item.scheduleType,
    frequency: item.frequency ?? undefined,
    mileageIntervalKm: item.mileageIntervalKm ?? undefined,
  }));
}

export function ContractForm({
  initialContract,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: ContractFormProps) {
  const styles = useThemedStyles(createStyles);

  const { control, handleSubmit, reset } = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      contractMode: initialContract?.contractMode ?? 'daily_shift',
      paymentFrequency: initialContract?.paymentFrequency ?? 'weekly',
      rentAmount: initialContract?.rentAmount ?? 0,
      startDate: initialContract ? formatDate(initialContract.startDate) : '',
      endDate: initialContract ? formatDate(initialContract.endDate) : '',
      fuelResponsibility: initialContract?.fuelResponsibility ?? 'driver',
      maintenanceResponsibility: initialContract?.maintenanceResponsibility ?? 'owner',
      damageResponsibility: initialContract?.damageResponsibility ?? 'driver',
      initialOdometerKm: initialContract?.initialOdometerKm ?? undefined,
      maintenanceChecklist: initialContract
        ? mapContractChecklist(initialContract)
        : DEFAULT_MAINTENANCE_PRESETS,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'maintenanceChecklist',
  });

  useEffect(() => {
    if (initialContract) {
      reset({
        contractMode: initialContract.contractMode,
        paymentFrequency: initialContract.paymentFrequency,
        rentAmount: initialContract.rentAmount,
        startDate: formatDate(initialContract.startDate),
        endDate: formatDate(initialContract.endDate),
        fuelResponsibility: initialContract.fuelResponsibility,
        maintenanceResponsibility: initialContract.maintenanceResponsibility,
        damageResponsibility: initialContract.damageResponsibility,
        initialOdometerKm: initialContract.initialOdometerKm,
        maintenanceChecklist: mapContractChecklist(initialContract),
      });
    }
  }, [initialContract, reset]);

  return (
    <View style={styles.form}>
      {errorMessage ? <AuthErrorBanner message={errorMessage} /> : null}

      <Controller
        control={control}
        name="contractMode"
        render={({ field, fieldState }) => (
          <OptionSelector
            label="Contract mode"
            value={field.value}
            options={CONTRACT_MODES}
            labels={CONTRACT_MODE_LABELS}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="paymentFrequency"
        render={({ field, fieldState }) => (
          <OptionSelector
            label="Payment frequency"
            value={field.value}
            options={PAYMENT_FREQUENCIES}
            labels={PAYMENT_FREQUENCY_LABELS}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="rentAmount"
        render={({ field, fieldState }) => (
          <Input
            label="Rent amount"
            value={String(field.value ?? '')}
            onChangeText={(text) => {
              if (text === '') {
                return;
              }
              const parsed = Number(text);
              if (!Number.isNaN(parsed)) {
                field.onChange(parsed);
              }
            }}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="number-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="startDate"
        render={({ field, fieldState }) => (
          <Input
            label="Start date"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="endDate"
        render={({ field, fieldState }) => (
          <Input
            label="End date"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
          />
        )}
      />

      <MaintenanceChecklistEditor
        control={control}
        fields={fields}
        append={append}
        replace={replace}
        remove={remove}
      />

      <AppText variant="label">Responsibilities</AppText>

      <Controller
        control={control}
        name="fuelResponsibility"
        render={({ field, fieldState }) => (
          <OptionSelector
            label="Fuel"
            value={field.value}
            options={RESPONSIBILITY_PARTIES}
            labels={RESPONSIBILITY_LABELS}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="maintenanceResponsibility"
        render={({ field, fieldState }) => (
          <OptionSelector
            label="Maintenance"
            value={field.value}
            options={RESPONSIBILITY_PARTIES}
            labels={RESPONSIBILITY_LABELS}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="damageResponsibility"
        render={({ field, fieldState }) => (
          <OptionSelector
            label="Damage"
            value={field.value}
            options={RESPONSIBILITY_PARTIES}
            labels={RESPONSIBILITY_LABELS}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
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
