import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius } from '../theme';

/** Selectable pill (gender, preferences). */
export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.card,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 14, color: colors.text },
  textSelected: { color: '#FFFFFF', fontWeight: '600' },
});
