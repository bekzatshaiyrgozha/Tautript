import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../components/Avatar';
import { BottomSheet } from '../../components/BottomSheet';
import { EmptyState } from '../../components/EmptyState';
import { MountainCard } from '../../components/MountainCard';
import { LEVEL_ORDER, LEVELS } from '../../data/levels';
import { MOUNTAINS } from '../../data/mountains';
import type { Level, Mountain } from '../../data/types';
import { useI18n, type Lang, type StringKey } from '../../i18n';
import { useAuth } from '../../state/auth';
import { useStore } from '../../state/store';
import { colors, radius } from '../../theme';

type SortKey = 'popular' | 'heightAsc' | 'heightDesc' | 'level' | 'name';

const SORTS: { key: SortKey; labelKey: StringKey }[] = [
  { key: 'popular', labelKey: 'sort.popular' },
  { key: 'heightAsc', labelKey: 'sort.heightAsc' },
  { key: 'heightDesc', labelKey: 'sort.heightDesc' },
  { key: 'level', labelKey: 'sort.level' },
  { key: 'name', labelKey: 'sort.name' },
];

function sortMountains(list: Mountain[], sort: SortKey, lang: Lang): Mountain[] {
  const copy = [...list];
  switch (sort) {
    case 'heightAsc':
      return copy.sort((a, b) => a.heightM - b.heightM);
    case 'heightDesc':
      return copy.sort((a, b) => b.heightM - a.heightM);
    case 'level':
      return copy.sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
    case 'name':
      return copy.sort((a, b) => a.name[lang].localeCompare(b.name[lang], lang));
    default:
      return copy;
  }
}

export default function HomeScreen() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { profile } = useStore();
  const name = user?.name ?? '';
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('popular');
  const [levels, setLevels] = useState<Level[]>([]);
  const [sheet, setSheet] = useState<'sort' | 'filter' | null>(null);

  const mountains = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Search matches the name in any of the three languages
    const matches = (m: Mountain) => !q || Object.values(m.name).some((n) => n.toLowerCase().includes(q));
    const filtered = MOUNTAINS.filter((m) => matches(m) && (levels.length === 0 || levels.includes(m.level)));
    return sortMountains(filtered, sort, lang);
  }, [query, sort, levels, lang]);

  const toggleLevel = (level: Level) =>
    setLevels((current) => (current.includes(level) ? current.filter((l) => l !== level) : [...current, level]));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/profile')} accessibilityLabel={t('tabs.profile')}>
          <Avatar uri={profile.avatarUri} name={name} size={48} />
        </Pressable>
        <View style={styles.greeting}>
          <Text style={styles.hello} numberOfLines={1}>
            {t('home.hello', { name })}
          </Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('home.search')}
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <ToolButton icon="swap-vertical" active={sort !== 'popular'} onPress={() => setSheet('sort')} label={t('home.sort')} />
        <ToolButton icon="options-outline" active={levels.length > 0} onPress={() => setSheet('filter')} label={t('home.filter')} />
      </View>

      <FlatList
        data={mountains}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MountainCard mountain={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <EmptyState icon="search" title={t('home.emptyTitle')} text={t('home.emptyText')} />
        }
      />

      <BottomSheet visible={sheet === 'sort'} title={t('home.sort')} onClose={() => setSheet(null)}>
        {SORTS.map((option) => (
          <Pressable
            key={option.key}
            style={styles.option}
            onPress={() => {
              setSort(option.key);
              setSheet(null);
            }}
          >
            <Text style={styles.optionText}>{t(option.labelKey)}</Text>
            <Ionicons
              name={sort === option.key ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={sort === option.key ? colors.primary : colors.border}
            />
          </Pressable>
        ))}
      </BottomSheet>

      <BottomSheet visible={sheet === 'filter'} title={t('home.filter')} onClose={() => setSheet(null)}>
        <Text style={styles.sheetLabel}>{t('filter.level')}</Text>
        <View style={styles.levelRow}>
          {LEVEL_ORDER.map((level) => {
            const active = levels.includes(level);
            return (
              <Pressable
                key={level}
                onPress={() => toggleLevel(level)}
                style={[
                  styles.levelOption,
                  active && { backgroundColor: LEVELS[level].background, borderColor: LEVELS[level].color },
                ]}
              >
                <Text style={[styles.levelText, active && { color: LEVELS[level].color }]}>{t(LEVELS[level].labelKey)}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.sheetActions}>
          <Pressable style={[styles.button, styles.buttonGhost]} onPress={() => setLevels([])}>
            <Text style={[styles.buttonText, styles.buttonGhostText]}>{t('filter.reset')}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => setSheet(null)}>
            <Text style={styles.buttonText}>{t('filter.show', { count: mountains.length })}</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

function ToolButton({
  icon,
  active,
  onPress,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.toolButton, active && styles.toolButtonActive]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={20} color={active ? '#FFFFFF' : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 8 },
  greeting: { flex: 1 },
  hello: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 2 },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 16 },
  search: {
    flex: 1,
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
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  separator: { height: 12 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  optionText: { fontSize: 16, color: colors.text },
  sheetLabel: { fontSize: 14, fontWeight: '600', color: colors.muted },
  levelRow: { flexDirection: 'row', gap: 8 },
  levelOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelText: { fontSize: 15, fontWeight: '600', color: colors.text },
  sheetActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  button: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: radius.md, backgroundColor: colors.primary },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  buttonGhost: { backgroundColor: colors.primarySoft },
  buttonGhostText: { color: colors.primary },
});
