import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Chip } from '../../components/Chip';
import { EmptyState } from '../../components/EmptyState';
import { HeartButton } from '../../components/HeartButton';
import { LandscapeArt } from '../../components/LandscapeArt';
import { LevelChip } from '../../components/LevelChip';
import { OfferCard } from '../../components/OfferCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { profileForSeasons } from '../../data/checklist';
import { getTour, upcomingDates, type Offer } from '../../data/tours';
import { useI18n, type StringKey } from '../../i18n';
import { colors, radius } from '../../theme';

type Filter = 'all' | 'soon' | 'oneDay' | 'multiDay';
type Sort = 'price' | 'date';

const FILTERS: { key: Filter; label: StringKey; test: (o: Offer) => boolean }[] = [
  { key: 'all', label: 'offers.all', test: () => true },
  { key: 'soon', label: 'offers.soon', test: (o) => upcomingDates(o).length > 0 },
  { key: 'oneDay', label: 'offers.oneDay', test: (o) => o.days === 1 },
  { key: 'multiDay', label: 'offers.multiDay', test: (o) => o.days > 1 },
];

const NO_DATE = '9999-12-31';

export default function TourScreen() {
  const { t, loc, priceFrom, dayRange, shortDate } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tour = getTour(id);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('price');

  const offers = useMemo(() => {
    if (!tour) return [];
    const test = FILTERS.find((f) => f.key === filter)!.test;
    return tour.offers.filter(test).sort((a, b) =>
      sort === 'price'
        ? (a.priceKzt ?? Infinity) - (b.priceKzt ?? Infinity)
        : (upcomingDates(a)[0] ?? NO_DATE).localeCompare(upcomingDates(b)[0] ?? NO_DATE),
    );
  }, [tour, filter, sort]);

  if (!tour) {
    return <EmptyState icon="alert-circle-outline" title={t('tours.notFound')} text={t('common.notFound')} />;
  }

  // Only show the filters that would leave something to see
  const filters = FILTERS.filter((f) => f.key === 'all' || tour.offers.some(f.test));

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerTintColor: '#FFFFFF',
          // Opened from a link (no history): offer a way back to Home
          headerLeft: router.canGoBack()
            ? undefined
            : () => (
                <Pressable onPress={() => router.replace('/')} hitSlop={10} accessibilityRole="button" style={styles.back}>
                  <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </Pressable>
              ),
          headerRight: () => (
            <View style={styles.heart}>
              <HeartButton kind="tours" id={tour.id} size={26} light />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <LandscapeArt art={tour.art} style={StyleSheet.absoluteFill} />
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0.35" stopColor="#0B1F18" stopOpacity="0" />
                <Stop offset="1" stopColor="#0B1F18" stopOpacity="0.78" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#shade)" />
          </Svg>
          <View style={styles.heroText}>
            <View style={styles.heroChips}>
              <LevelChip level={tour.level} />
              <View style={styles.glass}>
                <Ionicons name="time-outline" size={13} color="#FFFFFF" />
                <Text style={styles.glassText}>{dayRange(tour.minDays, tour.maxDays)}</Text>
              </View>
            </View>
            <Text style={styles.title}>{loc(tour.name)}</Text>
            <View style={styles.areaRow}>
              <Ionicons name="location" size={14} color="#DDEBE3" />
              <Text style={styles.area}>{loc(tour.area)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.summary}>
            <View style={styles.flex}>
              <Text style={styles.summaryPrice}>{priceFrom(tour.priceKzt)}</Text>
              <Text style={styles.summaryMeta}>
                {t('tours.companies', { count: tour.companies })}
                {tour.nextDate ? ` · ${t('tours.nextDate', { date: shortDate(tour.nextDate) })}` : ''}
              </Text>
            </View>
            <View style={styles.summaryIcon}>
              <Ionicons name="storefront-outline" size={22} color={colors.primaryDark} />
            </View>
          </View>

          <Text style={styles.description}>{loc(tour.description)}</Text>

          <View style={styles.sectionHead}>
            <Text style={styles.section}>{t('offers.title')}</Text>
            <Text style={styles.count}>{tour.offers.length}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chips}>
            {filters.map((f) => (
              <Chip key={f.key} label={t(f.label)} selected={filter === f.key} onPress={() => setFilter(f.key)} />
            ))}
          </ScrollView>

          <Pressable
            style={styles.sort}
            onPress={() => setSort(sort === 'price' ? 'date' : 'price')}
            accessibilityRole="button"
            hitSlop={6}
          >
            <Ionicons name="swap-vertical" size={16} color={colors.primary} />
            <Text style={styles.sortText}>{t(sort === 'price' ? 'offers.sortPrice' : 'offers.sortDate')}</Text>
          </Pressable>

          {offers.length > 0 ? (
            <View style={styles.offers}>
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>{t('offers.empty')}</Text>
          )}

          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primaryDark} />
            <Text style={styles.noteText}>{t('offers.note')}</Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label={t('tours.checklist')}
              variant="outline"
              style={styles.flex}
              onPress={() => router.push({ pathname: '/checklist', params: { profile: profileForSeasons(tour.seasons) } })}
            />
            <PrimaryButton
              label={t('tours.compareThis')}
              variant="outline"
              style={styles.flex}
              onPress={() => router.navigate('/(tabs)/tours')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  heart: { paddingRight: 8 },
  back: { paddingLeft: 8 },
  content: { paddingBottom: 28 },
  hero: { height: 280, justifyContent: 'flex-end', backgroundColor: colors.primaryDark },
  heroText: { padding: 20, paddingBottom: 30, gap: 8 },
  heroChips: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  glass: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  glassText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  area: { fontSize: 14, color: '#DDEBE3' },
  body: { padding: 16, gap: 14, marginTop: -18, backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    shadowColor: '#0F2A22',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  summaryPrice: { fontSize: 24, fontWeight: '800', color: colors.primaryDark },
  summaryMeta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  summaryIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  description: { fontSize: 15, lineHeight: 23, color: colors.text },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  section: { fontSize: 19, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  count: {
    minWidth: 26,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    overflow: 'hidden',
  },
  chipsScroll: { marginHorizontal: -16 },
  chips: { paddingHorizontal: 16, gap: 8 },
  sort: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  sortText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  offers: { gap: 12 },
  empty: { fontSize: 14, color: colors.muted, textAlign: 'center', paddingVertical: 16 },
  note: { flexDirection: 'row', gap: 10, backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: 12 },
  noteText: { flex: 1, fontSize: 13, lineHeight: 18, color: colors.muted },
  actions: { flexDirection: 'row', gap: 10 },
});
