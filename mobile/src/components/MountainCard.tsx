import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Mountain } from '../data/types';
import { useI18n } from '../i18n';
import { colors, radius } from '../theme';
import { HeartButton } from './HeartButton';
import { LevelChip } from './LevelChip';

export function MountainCard({ mountain }: { mountain: Mountain }) {
  const { t, loc, num, duration } = useI18n();
  return (
    <Pressable
      onPress={() => router.push(`/mountain/${mountain.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={1}>
          {loc(mountain.name)}
        </Text>
        <View style={styles.height}>
          <Ionicons name="triangle" size={10} color={colors.primary} />
          <Text style={styles.heightText}>{num(mountain.heightM)} {t('unit.m')}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <LevelChip level={mountain.level} />
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={15} color={colors.muted} />
          <Text style={styles.metaText}>{duration(mountain.duration)}</Text>
        </View>
        <View style={styles.spacer} />
        <HeartButton kind="mountains" id={mountain.id} />
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {loc(mountain.description)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  pressed: { opacity: 0.85 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.text },
  height: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  heightText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 14, color: colors.muted },
  spacer: { flex: 1 },
  description: { fontSize: 14, lineHeight: 20, color: colors.muted },
});
