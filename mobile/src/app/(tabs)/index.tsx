import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Avatar } from '../../components/Avatar';
import { HeartButton } from '../../components/HeartButton';
import { LandscapeArt } from '../../components/LandscapeArt';
import { LevelChip } from '../../components/LevelChip';
import { MountainThumb } from '../../components/MountainThumb';
import { DATA_UPDATED, SOURCE_COMPANIES, TOURS, type Tour } from '../../data/tours';
import { useI18n, type StringKey } from '../../i18n';
import { useAuth } from '../../state/auth';
import { useStore } from '../../state/store';
import { colors, radius } from '../../theme';

type Quick = { icon: keyof typeof Ionicons.glyphMap; labelKey: StringKey; go: () => void };

const HOW: { icon: keyof typeof Ionicons.glyphMap; title: StringKey; text: StringKey }[] = [
  { icon: 'search', title: 'home.how1.title', text: 'home.how1.text' },
  { icon: 'git-compare-outline', title: 'home.how2.title', text: 'home.how2.text' },
  { icon: 'checkbox-outline', title: 'home.how3.title', text: 'home.how3.text' },
];

export default function HomeScreen() {
  const { t, date } = useI18n();
  const { user } = useAuth();
  const { profile } = useStore();
  const name = user?.name ?? '';

  const quick: Quick[] = [
    { icon: 'map-outline', labelKey: 'home.quickTours', go: () => router.navigate('/(tabs)/tours') },
    { icon: 'bag-handle-outline', labelKey: 'home.quickEquipment', go: () => router.navigate('/(tabs)/equipment') },
    { icon: 'checkbox-outline', labelKey: 'home.quickChecklist', go: () => router.push('/checklist') },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View style={styles.brand}>
            <MountainThumb size={34} />
            <Text style={styles.brandText}>TauTrip</Text>
          </View>
          <Pressable onPress={() => router.navigate('/(tabs)/profile')} accessibilityLabel={t('tabs.profile')}>
            <Avatar uri={profile.avatarUri} name={name} size={40} />
          </Pressable>
        </View>

        <Text style={styles.hello} numberOfLines={1}>
          {t('home.hello', { name })}
        </Text>

        <View style={styles.hero}>
          <LandscapeArt art="peak" style={StyleSheet.absoluteFill} />
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="home-shade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0.1" stopColor="#0B1F18" stopOpacity="0.05" />
                <Stop offset="1" stopColor="#0B1F18" stopOpacity="0.82" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#home-shade)" />
          </Svg>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{t('home.heroTitle')}</Text>
            <Text style={styles.heroSub}>{t('home.heroText')}</Text>
            <Pressable style={styles.heroButton} onPress={() => router.navigate('/(tabs)/tours')} accessibilityRole="button">
              <Text style={styles.heroButtonText}>{t('home.heroCta')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.quickRow}>
          {quick.map((q) => (
            <Pressable key={q.labelKey} style={styles.quick} onPress={q.go} accessibilityRole="button">
              <View style={styles.quickIcon}>
                <Ionicons name={q.icon} size={22} color={colors.primaryDark} />
              </View>
              <Text style={styles.quickLabel}>{t(q.labelKey)}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.section}>{t('home.popular')}</Text>
          <Pressable onPress={() => router.navigate('/(tabs)/tours')} hitSlop={8}>
            <Text style={styles.link}>{t('home.seeAll')}</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={styles.carouselContent}>
          {TOURS.map((tour) => (
            <FeaturedCard key={tour.id} tour={tour} />
          ))}
        </ScrollView>

        <Text style={styles.section}>{t('home.how')}</Text>
        <View style={styles.how}>
          {HOW.map((step, index) => (
            <View key={step.title} style={styles.howRow}>
              <View style={styles.howIcon}>
                <Ionicons name={step.icon} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.howBody}>
                <Text style={styles.howTitle}>
                  {index + 1}. {t(step.title)}
                </Text>
                <Text style={styles.howText}>{t(step.text)}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.note}>
          {t('home.dataNote')} {t('tours.dataNote', { count: SOURCE_COMPANIES, date: date(DATA_UPDATED) })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeaturedCard({ tour }: { tour: Tour }) {
  const { t, loc, priceFrom, dayRange } = useI18n();
  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => router.push(`/tour/${tour.id}`)}
        style={({ pressed }) => pressed && styles.pressed}
        accessibilityRole="button"
      >
        <View style={styles.cardImage}>
          <LandscapeArt art={tour.art} style={StyleSheet.absoluteFill} />
          <View style={styles.price}>
            <Text style={styles.priceText}>{priceFrom(tour.priceKzt)}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {loc(tour.name)}
          </Text>
          <View style={styles.cardMeta}>
            <LevelChip level={tour.level} />
            <Text style={styles.cardDuration}>
              {t('tours.companies', { count: tour.companies })} · {dayRange(tour.minDays, tour.maxDays)}
            </Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.cardHeart}>
        <HeartButton kind="tours" id={tour.id} size={20} light />
      </View>
    </View>
  );
}

const shadow = {
  shadowColor: '#0F2A22',
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
} as const;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandText: { fontSize: 22, fontWeight: '800', color: colors.primaryDark, letterSpacing: -0.5 },
  hello: { fontSize: 15, color: colors.muted, marginTop: -4 },
  hero: { height: 210, borderRadius: radius.lg + 4, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.primaryDark },
  heroText: { padding: 18, gap: 6 },
  heroTitle: { fontSize: 26, lineHeight: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  heroSub: { fontSize: 14, lineHeight: 20, color: '#DCEBE3' },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  heroButtonText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  quickRow: { flexDirection: 'row', gap: 10 },
  quick: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    ...shadow,
    shadowOpacity: 0.05,
  },
  quickIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  section: { fontSize: 19, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  link: { fontSize: 14, fontWeight: '600', color: colors.primary },
  carousel: { marginHorizontal: -16 },
  carouselContent: { paddingHorizontal: 16, gap: 12, paddingBottom: 10 },
  card: { width: 228, backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', ...shadow },
  pressed: { opacity: 0.88 },
  cardImage: { height: 128, backgroundColor: colors.primaryDark },
  price: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(11,31,24,0.62)',
  },
  priceText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  cardHeart: { position: 'absolute', left: 10, top: 10 },
  cardBody: { padding: 12, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardDuration: { fontSize: 13, color: colors.muted },
  how: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, gap: 16, ...shadow, shadowOpacity: 0.05 },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  howIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  howBody: { flex: 1, gap: 2 },
  howTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  howText: { fontSize: 13, lineHeight: 18, color: colors.muted },
  note: { fontSize: 12, lineHeight: 18, color: colors.muted, textAlign: 'center' },
});
