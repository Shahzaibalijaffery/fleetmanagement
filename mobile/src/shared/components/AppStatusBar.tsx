import { StatusBar } from 'react-native';

import { useTheme } from '@/shared/theme';

export function AppStatusBar() {
  const { isDark } = useTheme();

  return <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;
}
