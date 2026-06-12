import { Modal, Pressable, Text, View } from 'react-native';

import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './AppModal.styles';
import type { AppModalProps } from './AppModal.types';

export function AppModal({
  visible,
  onClose,
  title,
  children,
  style,
}: AppModalProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose} accessibilityRole="button">
        <Pressable
          style={[styles.modal, style]}
          onPress={(event) => event.stopPropagation()}
          accessibilityViewIsModal
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
              hitSlop={8}
            >
              <Text style={styles.closeLabel}>×</Text>
            </Pressable>
          </View>
          <View style={styles.body}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
