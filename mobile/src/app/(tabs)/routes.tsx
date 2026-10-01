import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteCard } from '../../components/RouteCard';
import { Segmented } from '../../components/Segmented';
import { LEVELS } from '../../data/levels';
import { ROUTES } from '../../data/routes';
import type { Level } from '../../data/types';
import { useI18n, type StringKey } from '../../i18n';
import { colors } from '../../theme';

type LevelFilter = 'all' | Level;

const OPTIONS: { value: LevelFilter; labelKey: StringKey }[] = [
  { value: 'all', labelKey: 'routes.all' },
  { value: 'easy', labelKey: LEVELS.easy.labelKey },
  { value: 'medium', labelKey: LEVELS.medium.labelKey },
  { value: 'hard', labelKey: LEVELS.hard.labelKey },
];

export default function RoutesScreen() {
  const { t } = useI18n();
  const [level, setLevel] = useState<LevelFilter>('all');
  const routes = useMemo(() => (level === 'all' ? ROUTES : ROUTES.filter((r) => r.level === level)), [level]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={routes}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <RouteCard route={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('routes.title')}</Text>
            <Text style={styles.subtitle}>{t('routes.subtitle')}</Text>
            <Segmented
              options={OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
              value={level}
              onChange={setLevel}
            />
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>{t('routes.empty')}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 24 },
  header: { gap: 8, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 4 },
  separator: { height: 12 },
  empty: { textAlign: 'center', color: colors.muted, paddingVertical: 32 },
});
