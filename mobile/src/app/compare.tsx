import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { LevelChip } from '../components/LevelChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { getTour, type Tour } from '../data/tours';
import { useI18n } from '../i18n';
import { colors, radius } from '../theme';

export default function CompareScreen() {
  const { t, loc, priceFrom, dayRange, shortDate } = useI18n();
  const { ids } = useLocalSearchParams<{ ids?: string }>();
  const tours = (ids ?? '')
    .split(',')
    .map((id) => getTour(id))
    .filter((tour): tour is Tour => Boolean(tour));

  // A one-day hike next to a multi-day trek is not a fair comparison
  const dissimilar = tours.some((x) => x.maxDays === 1) && tours.some((x) => x.minDays > 1);

  const rows: { label: string; render: (tour: Tour) => React.ReactNode }[] = [
    { label: t('compare.cheapest'), render: (x) => <Text style={styles.value}>{priceFrom(x.priceKzt)}</Text> },
    { label: t('compare.companies'), render: (x) => <Text style={styles.value}>{x.companies}</Text> },
    { label: t('tours.duration'), render: (x) => <Text style={styles.value}>{dayRange(x.minDays, x.maxDays)}</Text> },
    { label: t('tours.difficulty'), render: (x) => <LevelChip level={x.level} /> },
    { label: t('compare.next'), render: (x) => <Text style={styles.value}>{x.nextDate ? shortDate(x.nextDate) : '—'}</Text> },
    { label: t('tours.location'), render: (x) => <Text style={styles.value}>{loc(x.area)}</Text> },
  ];


  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <Stack.Screen options={{ title: t('compare.title') }} />
      {tours.length < 2 ? (
        <EmptyState icon="git-compare-outline" title={t('compare.title')} text={t('compare.empty')} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {dissimilar && (
            <View style={styles.warning} accessibilityRole="alert">
              <Ionicons name="warning-outline" size={20} color={colors.warningText} />
              <Text style={styles.warningText}>{t('compare.warning')}</Text>
            </View>
          )}

          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.labelCell} />
              {tours.map((x) => (
                <Text key={x.id} style={[styles.cell, styles.head]} numberOfLines={3}>
                  {loc(x.name)}
                </Text>
              ))}
            </View>
            {rows.map((r) => (
              <View key={r.label} style={[styles.row, styles.rowBorder]}>
                <Text style={styles.labelCell}>{r.label}</Text>
                {tours.map((x) => (
                  <View key={x.id} style={styles.cell}>
                    {r.render(x)}
                  </View>
                ))}
              </View>
            ))}
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.labelCell} />
              {tours.map((x) => (
                <View key={x.id} style={styles.cell}>
                  <PrimaryButton
                    label={t('compare.open')}
                    variant="outline"
                    style={styles.visit}
                    onPress={() => router.push(`/tour/${x.id}`)}
                  />
                </View>
              ))}
            </View>
          </View>

          <PrimaryButton label={t('compare.change')} variant="outline" onPress={() => router.back()} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16 },
  warning: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: colors.warning,
    borderRadius: radius.md,
    padding: 12,
  },
  warningText: { flex: 1, fontSize: 13, lineHeight: 18, color: colors.warningText, fontWeight: '600' },
  table: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  labelCell: { width: 72, fontSize: 12, color: colors.muted },
  cell: { flex: 1, alignItems: 'flex-start' },
  head: { fontSize: 14, fontWeight: '700', color: colors.text },
  value: { fontSize: 14, color: colors.text },
  visit: { minHeight: 36, paddingHorizontal: 8, width: '100%' },
});
