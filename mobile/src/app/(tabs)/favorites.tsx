import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/EmptyState';
import { MountainCard } from '../../components/MountainCard';
import { RouteCard } from '../../components/RouteCard';
import { Segmented } from '../../components/Segmented';
import { MOUNTAINS } from '../../data/mountains';
import { ROUTES } from '../../data/routes';
import { useI18n } from '../../i18n';
import { useStore, type FavoriteKind } from '../../state/store';
import { colors } from '../../theme';

export default function FavoritesScreen() {
  const { t } = useI18n();
  const { favorites } = useStore();
  const [tab, setTab] = useState<FavoriteKind>('mountains');

  const mountains = MOUNTAINS.filter((m) => favorites.mountains.includes(m.id));
  const routes = ROUTES.filter((r) => favorites.routes.includes(r.id));

  const header = (
    <View style={styles.header}>
      <Text style={styles.title}>{t('fav.title')}</Text>
      <Segmented
        options={[
          { value: 'mountains', label: t('fav.mountains', { count: mountains.length }) },
          { value: 'routes', label: t('fav.routes', { count: routes.length }) },
        ]}
        value={tab}
        onChange={setTab}
      />
    </View>
  );

  const empty = (
    <EmptyState
      icon="heart-outline"
      title={t('fav.emptyTitle')}
      text={t(tab === 'mountains' ? 'fav.emptyMountains' : 'fav.emptyRoutes')}
    />
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {tab === 'mountains' ? (
        <FlatList
          data={mountains}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MountainCard mountain={item} />}
          ListHeaderComponent={header}
          ListEmptyComponent={empty}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => <RouteCard route={item} />}
          ListHeaderComponent={header}
          ListEmptyComponent={empty}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 24 },
  header: { gap: 12, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  separator: { height: 12 },
});
