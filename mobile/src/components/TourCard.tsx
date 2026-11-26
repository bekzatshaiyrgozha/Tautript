import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Tour } from '../data/tours';
import { useI18n } from '../i18n';
import { colors, radius } from '../theme';
import { LevelChip } from './LevelChip';
import { LandscapeArt } from './LandscapeArt';

/** One tour in a list. Tap opens the details; `right` is a slot for a checkbox or a heart. */
export function TourCard({ tour, right }: { tour: Tour; right?: ReactNode }) {
  const { t, loc, priceFrom, dayRange } = useI18n();
  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => router.push(`/tour/${tour.id}`)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        <LandscapeArt art={tour.art} style={styles.thumb} />
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {loc(tour.name)}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {t('tours.companies', { count: tour.companies })} · {dayRange(tour.minDays, tour.maxDays)}
          </Text>
          <View style={styles.row}>
            <LevelChip level={tour.level} />
            <Text style={styles.price}>{priceFrom(tour.priceKzt)}</Text>
          </View>
        </View>
      </Pressable>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    shadowColor: '#0F2A22',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  pressed: { opacity: 0.85 },
  thumb: { width: 72, height: 72, borderRadius: 14 },
  body: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  price: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
});
