import type { NavigationProp } from '@react-navigation/native';

import type { RootStackParamList } from '@/app/navigation/types';

import type { AuthResponse } from '../types/auth.types';

export function navigateAfterAuth(
  navigation: NavigationProp<RootStackParamList>,
  result: AuthResponse,
) {
  if (result.needsOnboarding) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', params: { screen: 'Onboarding' } }],
    });
    return;
  }

  navigation.reset({
    index: 0,
    routes: [{ name: 'Main', params: { screen: 'Home' } }],
  });
}
