import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Route } from '../data/types';
import { useI18n } from '../i18n';
import { colors, radius } from '../theme';
import { HeartButton } from './HeartButton';
import { LevelChip } from './LevelChip';

export function RouteCard({ route }: { route: Route }) {
  const { t, loc, num, duration, season } = useI18n();
  return (
    <Pressable
      onPress={() => router.push(`/route/${route.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.titleBox}>
          <Text style={styles.title} numberOfLines={1}>
            {loc(route.name)}
          </Text>
          <Text style={styles.start} numberOfLines={1}>
            {t('routes.start', { place: loc(route.start) })}
          </Text>
        </View>
        <HeartButton kind="routes" id={route.id} />
      </View>

      <View style={styles.stats}>
        <Stat icon="walk-outline" text={`${route.distanceKm} ${t('unit.km')}`} />
        <Stat icon="trending-up-outline" text={`${num(route.gainM)} ${t('unit.m')}`} />
        <Stat icon="time-outline" text={duration(route.duration)} />
      </View>

      <View style={styles.bottom}>
        <LevelChip level={route.level} />
        <Text style={styles.season}>{season(route.season)}</Text>
      </View>
    </Pressable>
  );
}

function Stat({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.statText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  pressed: { opacity: 0.85 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  titleBox: { flex: 1, gap: 2 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  start: { fontSize: 13, color: colors.muted },
  stats: { flexDirection: 'row', gap: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 14, fontWeight: '600', color: colors.text },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  season: { fontSize: 13, color: colors.muted },
});
