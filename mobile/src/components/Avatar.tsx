import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

export function Avatar({ uri, name, size = 44 }: { uri: string | null; name: string; size?: number }) {
  const box = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[styles.base, box]} />;
  }
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <View style={[styles.base, styles.placeholder, box]}>
      {initial ? (
        <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
      ) : (
        <Ionicons name="person" size={size * 0.5} color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.primarySoft },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.primary, fontWeight: '700' },
});
