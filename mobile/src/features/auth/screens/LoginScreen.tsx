import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { AuthStackParamList } from '@/app/navigation/types';

import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { AuthFormLayout } from '../components/AuthFormLayout';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginFormValues } from '../validation/auth.schemas';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const login = useLogin();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => {
        navigation.getParent()?.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      },
    });
  });

  return (
    <AuthFormLayout
      title="Welcome back"
      subtitle="Sign in to your FleetLink account"
      footer={
        <View>
          <Pressable onPress={() => navigation.navigate('Register')} accessibilityRole="button">
            <AppText variant="bodySmall" color="primary" align="center">
              Don&apos;t have an account? Register
            </AppText>
          </Pressable>
        </View>
      }
    >
      {login.isError ? <AuthErrorBanner message={getErrorMessage(login.error)} /> : null}

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
            autoComplete="password"
          />
        )}
      />

      <Pressable
        onPress={() => navigation.navigate('ForgotPassword')}
        accessibilityRole="button"
      >
        <AppText variant="bodySmall" color="primary">
          Forgot password?
        </AppText>
      </Pressable>

      <Button
        title="Sign in"
        onPress={onSubmit}
        loading={login.isPending}
        fullWidth
      />
    </AuthFormLayout>
  );
}
