import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Checkbox } from '../../components/Checkbox';
import { Chip } from '../../components/Chip';
import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { TourCard } from '../../components/TourCard';
import { LEVEL_ORDER, LEVELS } from '../../data/levels';
import { DATA_UPDATED, MAX_COMPARE, SOURCE_COMPANIES, TOURS } from '../../data/tours';
import type { Level } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, radius } from '../../theme';

export default function ToursScreen() {
  const { t, loc, date } = useI18n();
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [selected, setSelected] = useState<string[]>([]);

  const tours = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOURS.filter(
      (tour) =>
        (level === 'all' || tour.level === level) &&
        (!q || Object.values(tour.name).some((n) => n.toLowerCase().includes(q))),
    );
  }, [query, level]);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : current.length < MAX_COMPARE ? [...current, id] : current,
    );

  const canCompare = selected.length >= 2;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={tours}
        keyExtractor={(tour) => tour.id}
        contentContainerStyle={[styles.list, selected.length > 0 && styles.listWithBar]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('tours.title')}</Text>
            <Text style={styles.subtitle}>{t('tours.dataNote', { count: SOURCE_COMPANIES, date: date(DATA_UPDATED) })}</Text>
            <View style={styles.search}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t('tours.search')}
                placeholderTextColor={colors.placeholder}
                style={styles.searchInput}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>
            <View style={styles.chips}>
              <Chip label={t('tours.all')} selected={level === 'all'} onPress={() => setLevel('all')} />
              {LEVEL_ORDER.map((l) => (
                <Chip key={l} label={t(LEVELS[l].labelKey)} selected={level === l} onPress={() => setLevel(l)} />
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TourCard
            tour={item}
            right={
              <Checkbox
                checked={selected.includes(item.id)}
                onPress={() => toggle(item.id)}
                label={`${t('tours.compare')}: ${loc(item.name)}`}
                disabled={!selected.includes(item.id) && selected.length >= MAX_COMPARE}
              />
            }
          />
        )}
        ListEmptyComponent={<EmptyState icon="search" title={t('tours.empty')} text="" />}
      />

      {selected.length > 0 && (
        <View style={styles.bar}>
          <View style={styles.barText}>
            <Text style={styles.barTitle}>{t('tours.selected', { count: selected.length, max: MAX_COMPARE })}</Text>
            <Text style={styles.barHint}>{t(canCompare ? 'tours.selectHint' : 'tours.selectMore')}</Text>
          </View>
          <PrimaryButton
            label={t('tours.compare')}
            variant="accent"
            disabled={!canCompare}
            style={styles.barButton}
            onPress={() => router.push({ pathname: '/compare', params: { ids: selected.join(',') } })}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 24 },
  listWithBar: { paddingBottom: 96 },
  header: { gap: 10, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.text, height: '100%' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  separator: { height: 10 },
  bar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingLeft: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryDark,
  },
  barText: { flex: 1 },
  barTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  barHint: { fontSize: 12, color: '#CFE3DB', marginTop: 2 },
  barButton: { minHeight: 42, paddingHorizontal: 18 },
});
