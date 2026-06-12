import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './ScreenContainer.styles';
import type { ScreenContainerProps } from './ScreenContainer.types';

export function ScreenContainer({
  children,
  scrollable = false,
  edges = ['top', 'bottom'],
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  const styles = useThemedStyles(createStyles);

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.container, style]} edges={edges}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
}
