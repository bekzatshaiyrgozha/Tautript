import { StyleSheet, Text, View } from 'react-native';

import { LEVELS } from '../data/levels';
import type { Level } from '../data/types';
import { useI18n } from '../i18n';
import { radius } from '../theme';

export function LevelChip({ level }: { level: Level }) {
  const { t } = useI18n();
  const { labelKey, color, background } = LEVELS[level];
  return (
    <View style={[styles.chip, { backgroundColor: background }]}>
      <Text style={[styles.text, { color }]}>{t(labelKey)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  text: { fontSize: 13, fontWeight: '600' },
});
