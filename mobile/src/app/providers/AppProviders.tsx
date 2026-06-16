import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { PushNotificationProvider } from '@/features/push-notifications';
import { ThemeProvider } from '@/shared/theme';

import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>
          <PushNotificationProvider>{children}</PushNotificationProvider>
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
