import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@/shared/theme';

import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
