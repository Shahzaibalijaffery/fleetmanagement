import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { AuthSuccessBanner } from '@/features/auth/components/AuthSuccessBanner';
import { AppText, Button, Input } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import { useUpdateProfile } from '../hooks/useUpdateProfile';
import type { UserProfile } from '../types/profile.types';
import { driverProfileSchema, type DriverProfileFormValues } from '../validation/profile.schemas';
import { createStyles } from './ProfileForm.styles';

interface DriverProfileFormProps {
  profile: UserProfile;
}

export function DriverProfileForm({ profile }: DriverProfileFormProps) {
  const styles = useThemedStyles(createStyles);
  const updateProfile = useUpdateProfile();

  const { control, handleSubmit, reset } = useForm<DriverProfileFormValues>({
    resolver: zodResolver(driverProfileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone ?? '',
      city: profile.city ?? '',
      experience: profile.experience ?? 0,
    },
  });

  useEffect(() => {
    reset({
      name: profile.name,
      phone: profile.phone ?? '',
      city: profile.city ?? '',
      experience: profile.experience ?? 0,
    });
  }, [profile, reset]);

  return (
    <View style={styles.form}>
      <AppText variant="caption" color="textSecondary">
        Driver Profile
      </AppText>
      <AppText variant="bodySmall" color="textSecondary" style={styles.email}>
        {profile.email}
      </AppText>

      {updateProfile.isError ? (
        <AuthErrorBanner message={getErrorMessage(updateProfile.error)} />
      ) : null}
      {updateProfile.isSuccess ? (
        <AuthSuccessBanner message="Profile updated successfully" />
      ) : null}

      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Input
            label="Name"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            autoComplete="name"
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field, fieldState }) => (
          <Input
            label="Phone"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="phone-pad"
            autoComplete="tel"
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
        name="experience"
        render={({ field, fieldState }) => (
          <Input
            label="Experience (years)"
            value={String(field.value)}
            onChangeText={(text) => {
              const parsed = Number(text);
              field.onChange(Number.isNaN(parsed) ? 0 : parsed);
            }}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="number-pad"
          />
        )}
      />

      <Button
        title="Save profile"
        onPress={handleSubmit((values) => updateProfile.mutate(values))}
        loading={updateProfile.isPending}
        fullWidth
      />
    </View>
  );
}
