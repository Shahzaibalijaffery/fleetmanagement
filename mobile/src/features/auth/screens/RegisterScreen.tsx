import { Controller, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { AuthStackParamList } from '@/app/navigation/types';

import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { AuthFormLayout } from '../components/AuthFormLayout';
import { RoleSelector } from '../components/RoleSelector';
import { useRegister } from '../hooks/useRegister';
import { registerSchema, type RegisterFormValues } from '../validation/auth.schemas';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const register = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'driver',
      phone: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    register.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone || undefined,
      },
      {
        onSuccess: () => {
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        },
      },
    );
  });

  return (
    <AuthFormLayout
      title="Create account"
      subtitle="Join FleetLink as an owner or driver"
      onBack={() => navigation.goBack()}
      footer={
        <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button">
          <AppText variant="bodySmall" color="primary" align="center">
            Already have an account? Sign in
          </AppText>
        </Pressable>
      }
    >
      {register.isError ? (
        <AuthErrorBanner message={getErrorMessage(register.error)} />
      ) : null}

      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Input
            label="Full name"
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
        name="email"
        render={({ field, fieldState }) => (
          <Input
            label="Email"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        )}
      />

      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <RoleSelector
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field, fieldState }) => (
          <Input
            label="Phone (optional)"
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
        name="password"
        render={({ field, fieldState }) => (
          <Input
            label="Password"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            secureTextEntry
            autoComplete="new-password"
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <Input
            label="Confirm password"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            secureTextEntry
            autoComplete="new-password"
          />
        )}
      />

      <Button
        title="Create account"
        onPress={onSubmit}
        loading={register.isPending}
        fullWidth
      />
    </AuthFormLayout>
  );
}
