import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { AuthStackParamList } from '@/app/navigation/types';

import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { AuthFormLayout } from '../components/AuthFormLayout';
import { useResendOtp } from '../hooks/useResendOtp';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { verifyOtpSchema, type VerifyOtpFormValues } from '../validation/auth.schemas';
import { navigateAfterAuth } from '../utils/navigateAfterAuth';

type VerifyOtpScreenProps = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

export function VerifyOtpScreen({ navigation, route }: VerifyOtpScreenProps) {
  const { email, devOtpCode } = route.params;
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();
  const [latestDevCode, setLatestDevCode] = useState(devOtpCode);

  const { control, handleSubmit } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: devOtpCode ?? '' },
  });

  const onSubmit = handleSubmit((values) => {
    verifyOtp.mutate(
      { email, code: values.code },
      {
        onSuccess: (data) => {
          navigateAfterAuth(navigation.getParent()!, data);
        },
      },
    );
  });

  const handleResend = () => {
    resendOtp.mutate(
      { email },
      {
        onSuccess: (data) => {
          if (data.devOtpCode) {
            setLatestDevCode(data.devOtpCode);
          }
        },
      },
    );
  };

  return (
    <AuthFormLayout
      title="Verify email"
      subtitle={`Enter the 6-digit code sent to ${email}`}
      onBack={() => navigation.goBack()}
    >
      {verifyOtp.isError ? (
        <AuthErrorBanner message={getErrorMessage(verifyOtp.error)} />
      ) : null}

      {latestDevCode ? (
        <AppText variant="bodySmall" color="textSecondary">
          Dev code: {latestDevCode}
        </AppText>
      ) : null}

      <Controller
        control={control}
        name="code"
        render={({ field, fieldState }) => (
          <Input
            label="Verification code"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="one-time-code"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
        )}
      />

      <Button title="Verify" onPress={onSubmit} loading={verifyOtp.isPending} fullWidth />

      <Pressable onPress={handleResend} accessibilityRole="button">
        <AppText variant="bodySmall" color="primary" align="center">
          {resendOtp.isPending ? 'Sending…' : 'Resend code'}
        </AppText>
      </Pressable>
    </AuthFormLayout>
  );
}
