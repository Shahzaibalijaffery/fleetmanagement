import { Controller, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { AuthStackParamList } from '@/app/navigation/types';

import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { AuthFormLayout } from '../components/AuthFormLayout';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useRegister } from '../hooks/useRegister';
import { registerSchema, type RegisterFormValues } from '../validation/auth.schemas';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const register = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    register.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (data) => {
          navigation.navigate('VerifyOtp', {
            email: data.email,
            devOtpCode: data.devOtpCode,
          });
        },
      },
    );
  });

  return (
    <AuthFormLayout
      title="Create account"
      subtitle="Sign up with your email and password"
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

      <GoogleSignInButton onNavigate={navigation.getParent()!} />

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
        title="Continue"
        onPress={onSubmit}
        loading={register.isPending}
        fullWidth
      />
    </AuthFormLayout>
  );
}
