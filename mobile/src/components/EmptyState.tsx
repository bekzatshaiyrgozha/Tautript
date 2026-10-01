import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

export function EmptyState({ icon, title, text }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }) {
  return (
    <View style={styles.box}>
      <Ionicons name={icon} size={40} color={colors.border} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24, gap: 8 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'center' },
  text: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20 },
});
