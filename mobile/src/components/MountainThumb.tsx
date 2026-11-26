import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

/** Green mountain tile used instead of a tour photo (the data has no images yet). */
export function MountainThumb({ size = 48 }: { size?: number }) {
  const icon = Math.round(size * 0.55);
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.22 }]}>
      <Ionicons name="triangle" size={icon} color="#BFD9CF" style={styles.back} />
      <Ionicons name="triangle" size={icon} color="#FFFFFF" style={styles.front} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  back: { position: 'absolute', left: '12%', bottom: '14%' },
  front: { position: 'absolute', right: '14%', bottom: '14%', opacity: 0.95 },
});
