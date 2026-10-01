import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { HeartButton } from '../../components/HeartButton';
import { LevelChip } from '../../components/LevelChip';
import { getMountain } from '../../data/mountains';
import { getRoute } from '../../data/routes';
import { useI18n } from '../../i18n';
import { colors, radius } from '../../theme';

export default function RouteScreen() {
  const { t, loc, num, duration, season } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const route = getRoute(id);
  // Checked items by index, so the list survives a language switch
  const [packed, setPacked] = useState<number[]>([]);

  if (!route) {
    return <EmptyState icon="alert-circle-outline" title={t('route.notFound')} text={t('common.notFound')} />;
  }

  const mountain = route.mountainId ? getMountain(route.mountainId) : undefined;
  const togglePacked = (index: number) =>
    setPacked((list) => (list.includes(index) ? list.filter((x) => x !== index) : [...list, index]));

  return (
    <>
      <Stack.Screen
        options={{ title: loc(route.name), headerRight: () => <HeartButton kind="routes" id={route.id} size={24} /> }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{loc(route.name)}</Text>
          <LevelChip level={route.level} />
        </View>
        <Text style={styles.summary}>{loc(route.summary)}</Text>

        <View style={styles.grid}>
          <StatTile icon="walk-outline" label={t('route.distance')} value={`${route.distanceKm} ${t('unit.km')}`} />
          <StatTile icon="trending-up-outline" label={t('route.gain')} value={`${num(route.gainM)} ${t('unit.m')}`} />
          <StatTile icon="time-outline" label={t('route.time')} value={duration(route.duration)} />
          <StatTile icon="calendar-outline" label={t('route.season')} value={season(route.season)} />
        </View>

        {mountain && (
          <Pressable style={styles.mountainLink} onPress={() => router.push(`/mountain/${mountain.id}`)}>
            <Ionicons name="triangle" size={14} color={colors.primary} />
            <Text style={styles.mountainLinkText}>
              {loc(mountain.name)} · {num(mountain.heightM)} {t('unit.m')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        )}

        <View style={styles.weather}>
          <Ionicons name="partly-sunny-outline" size={28} color={colors.primary} />
          <View style={styles.weatherText}>
            <Text style={styles.weatherTitle}>{t('route.weatherTitle')}</Text>
            <Text style={styles.muted}>{t('route.weatherText')}</Text>
          </View>
        </View>

        <Text style={styles.section}>{t('route.stages')}</Text>
        <View>
          {route.stages.map((stage, index) => {
            const last = index === route.stages.length - 1;
            return (
              <View key={stage.time} style={styles.stage}>
                <View style={styles.stageRail}>
                  <View style={[styles.dot, last && styles.dotLast]} />
                  {!last && <View style={styles.line} />}
                </View>
                <View style={styles.stageBody}>
                  <Text style={styles.stageName}>{loc(stage.name)}</Text>
                  <Text style={styles.muted}>
                    {num(stage.altitudeM)} {t('unit.m')} · {stage.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.section}>{t('route.gear')}</Text>
          <Text style={styles.muted}>
            {packed.length}/{route.gear.length}
          </Text>
        </View>
        <View style={styles.card}>
          {route.gear.map((item, index) => {
            const done = packed.includes(index);
            return (
              <Pressable key={index} style={styles.gearRow} onPress={() => togglePacked(index)}>
                <Ionicons
                  name={done ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={done ? colors.primary : colors.muted}
                />
                <Text style={[styles.gearText, done && styles.gearDone]}>{loc(item)}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}

function StatTile({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.tile}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.text },
  summary: { fontSize: 15, lineHeight: 22, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 4,
  },
  tileValue: { fontSize: 17, fontWeight: '700', color: colors.text },
  tileLabel: { fontSize: 13, color: colors.muted },
  mountainLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 14,
  },
  mountainLinkText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.primary },
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    padding: 14,
  },
  weatherText: { flex: 1, gap: 2 },
  weatherTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  section: { fontSize: 18, fontWeight: '700', color: colors.text },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stage: { flexDirection: 'row', gap: 12 },
  stageRail: { alignItems: 'center', width: 16 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: colors.primary, backgroundColor: colors.card },
  dotLast: { backgroundColor: colors.primary },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  stageBody: { flex: 1, paddingBottom: 18 },
  stageName: { fontSize: 16, fontWeight: '600', color: colors.text },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  gearRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  gearText: { flex: 1, fontSize: 15, color: colors.text },
  gearDone: { color: colors.muted, textDecorationLine: 'line-through' },
  muted: { fontSize: 14, color: colors.muted },
});
