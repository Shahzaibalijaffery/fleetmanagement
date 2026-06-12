import { Controller, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { AuthStackParamList } from '@/app/navigation/types';

import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { AuthFormLayout } from '../components/AuthFormLayout';
import { AuthSuccessBanner } from '../components/AuthSuccessBanner';
import { useForgotPassword } from '../hooks/useForgotPassword';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../validation/auth.schemas';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const forgotPassword = useForgotPassword();
  const isSuccess = forgotPassword.isSuccess;

  const { control, handleSubmit, reset } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) => {
    forgotPassword.mutate(values);
  });

  const handleRetry = () => {
    forgotPassword.reset();
    reset();
  };

  if (forgotPassword.isError) {
    return (
      <AuthFormLayout
        title="Reset password"
        subtitle="Something went wrong"
        onBack={() => navigation.goBack()}
      >
        <AuthErrorBanner message={getErrorMessage(forgotPassword.error)} />
        <Button title="Try again" onPress={handleRetry} fullWidth />
        <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button">
          <AppText variant="bodySmall" color="primary" align="center">
            Back to sign in
          </AppText>
        </Pressable>
      </AuthFormLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthFormLayout
        title="Check your email"
        subtitle="Password reset request submitted"
        onBack={() => navigation.goBack()}
        footer={
          <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button">
            <AppText variant="bodySmall" color="primary" align="center">
              Back to sign in
            </AppText>
          </Pressable>
        }
      >
        <AuthSuccessBanner
          message={
            forgotPassword.data?.message ??
            'If an account exists for this email, you will receive reset instructions shortly.'
          }
        />
        <Button
          title="Back to sign in"
          onPress={() => navigation.navigate('Login')}
          variant="outline"
          fullWidth
        />
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Forgot password?"
      subtitle="Enter your email and we will send reset instructions"
      onBack={() => navigation.goBack()}
      footer={
        <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button">
          <AppText variant="bodySmall" color="primary" align="center">
            Back to sign in
          </AppText>
        </Pressable>
      }
    >
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

      <Button
        title="Send reset link"
        onPress={onSubmit}
        loading={forgotPassword.isPending}
        fullWidth
      />
    </AuthFormLayout>
  );
}
