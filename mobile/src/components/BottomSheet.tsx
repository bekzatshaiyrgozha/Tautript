import type { ReactNode } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '../i18n';
import { colors, radius } from '../theme';

type Props = { visible: boolean; title: string; onClose: () => void; children: ReactNode };

export function BottomSheet({ visible, title, onClose, children }: Props) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  const content = (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('common.close')} />
      <View style={[styles.sheet, { paddingBottom: 16 + insets.bottom }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
    </>
  );

  // Web preview: a fixed overlay stays inside the iPhone frame (a Modal would cover the whole page)
  if (Platform.OS === 'web') {
    return visible ? <View style={webOverlay}>{content}</View> : null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {content}
    </Modal>
  );
}

const webOverlay = { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1000 } as unknown as ViewStyle;

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg + 4,
    borderTopRightRadius: radius.lg + 4,
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
});
