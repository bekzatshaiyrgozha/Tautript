import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { HeartButton } from '../../components/HeartButton';
import { LevelChip } from '../../components/LevelChip';
import { RouteCard } from '../../components/RouteCard';
import { getMountain } from '../../data/mountains';
import { routesForMountain } from '../../data/routes';
import { useI18n } from '../../i18n';
import { colors, radius } from '../../theme';

export default function MountainScreen() {
  const { t, loc, num, duration } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const mountain = getMountain(id);

  if (!mountain) {
    return <EmptyState icon="alert-circle-outline" title={t('mountain.notFound')} text={t('common.notFound')} />;
  }

  const routes = routesForMountain(mountain.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: loc(mountain.name),
          headerRight: () => <HeartButton kind="mountains" id={mountain.id} size={24} />,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroHeight}>
            {num(mountain.heightM)} {t('unit.m')}
          </Text>
          <Text style={styles.heroName}>{loc(mountain.name)}</Text>
          <View style={styles.heroMeta}>
            <LevelChip level={mountain.level} />
            <Meta icon="time-outline" text={duration(mountain.duration)} />
            <Meta icon="location-outline" text={loc(mountain.area)} />
          </View>
        </View>

        <Text style={styles.description}>{loc(mountain.description)}</Text>

        <Text style={styles.section}>{t('mountain.routes')}</Text>
        {routes.length > 0 ? (
          <View style={styles.routes}>
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>{t('mountain.noRoutes')}</Text>
        )}
      </ScrollView>
    </>
  );
}

function Meta({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={15} color="#FFFFFF" />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 20, gap: 6 },
  heroHeight: { fontSize: 40, fontWeight: '800', color: '#FFFFFF' },
  heroName: { fontSize: 20, fontWeight: '600', color: '#FFFFFF', opacity: 0.9 },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 14, color: '#FFFFFF' },
  description: { fontSize: 16, lineHeight: 24, color: colors.text },
  section: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 8 },
  routes: { gap: 12 },
  muted: { fontSize: 14, color: colors.muted },
});
