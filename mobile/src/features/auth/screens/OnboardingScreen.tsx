import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, Button, Input } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { AuthStackParamList } from '@/app/navigation/types';

import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { AuthFormLayout } from '../components/AuthFormLayout';
import { RoleSelector } from '../components/RoleSelector';
import { useCompleteOnboarding } from '../hooks/useCompleteOnboarding';
import type { UserRole } from '../types/auth.types';
import {
  onboardingNameSchema,
  type OnboardingNameFormValues,
} from '../validation/auth.schemas';
import { navigateAfterAuth } from '../utils/navigateAfterAuth';

type OnboardingScreenProps = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

type OnboardingStep = 'name' | 'role' | 'phone';

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const completeOnboarding = useCompleteOnboarding();
  const [step, setStep] = useState<OnboardingStep>('name');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('driver');
  const [phone, setPhone] = useState('');

  const nameForm = useForm<OnboardingNameFormValues>({
    resolver: zodResolver(onboardingNameSchema),
    defaultValues: { name: '' },
  });

  const handleNameSubmit = nameForm.handleSubmit((values) => {
    setName(values.name);
    setStep('role');
  });

  const handleRoleContinue = () => {
    setStep('phone');
  };

  const finishOnboarding = () => {
    completeOnboarding.mutate(
      {
        name,
        role,
        phone: phone.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          navigateAfterAuth(navigation.getParent()!, data);
        },
      },
    );
  };

  if (step === 'name') {
    return (
      <AuthFormLayout title="Your name" subtitle="What should we call you?">
        <Controller
          control={nameForm.control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              label="Full name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoComplete="name"
              returnKeyType="done"
              onSubmitEditing={handleNameSubmit}
            />
          )}
        />
        <Button title="Continue" onPress={handleNameSubmit} fullWidth />
      </AuthFormLayout>
    );
  }

  if (step === 'role') {
    return (
      <AuthFormLayout
        title="Your role"
        subtitle="Are you a car owner or a driver?"
        onBack={() => setStep('name')}
      >
        <RoleSelector value={role} onChange={setRole} />
        <Button title="Continue" onPress={handleRoleContinue} fullWidth />
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Phone number"
      subtitle="Optional — add a number for fleet contact"
      onBack={() => setStep('role')}
    >
      {completeOnboarding.isError ? (
        <AuthErrorBanner message={getErrorMessage(completeOnboarding.error)} />
      ) : null}

      <Input
        label="Mobile number (optional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
        returnKeyType="done"
        onSubmitEditing={finishOnboarding}
      />

      <View>
        <Button
          title="Finish"
          onPress={finishOnboarding}
          loading={completeOnboarding.isPending}
          fullWidth
        />
        <Button title="Skip" onPress={finishOnboarding} variant="ghost" fullWidth />
      </View>
    </AuthFormLayout>
  );
}
