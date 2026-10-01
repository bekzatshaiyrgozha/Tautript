import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

/** Sign-up progress: `total` segments, the first `step` are filled. */
export function StepBar({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: step }}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.segment, i < step && styles.done]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border },
  done: { backgroundColor: colors.primary },
});
