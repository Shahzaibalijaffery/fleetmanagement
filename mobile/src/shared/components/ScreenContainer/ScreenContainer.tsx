import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
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

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
