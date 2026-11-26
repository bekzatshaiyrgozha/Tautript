import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/EmptyState';
import { HeartButton } from '../../components/HeartButton';
import { TourCard } from '../../components/TourCard';
import { TOURS } from '../../data/tours';
import { useI18n } from '../../i18n';
import { useStore } from '../../state/store';
import { colors } from '../../theme';

export default function FavoritesScreen() {
  const { t } = useI18n();
  const { favorites } = useStore();
  const tours = TOURS.filter((tour) => favorites.tours.includes(tour.id));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={tours}
        keyExtractor={(tour) => tour.id}
        renderItem={({ item }) => <TourCard tour={item} right={<HeartButton kind="tours" id={item.id} />} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('fav.title')}</Text>
            <Text style={styles.subtitle}>{t('fav.subtitle')}</Text>
          </View>
        }
        ListEmptyComponent={<EmptyState icon="heart-outline" title={t('fav.emptyTitle')} text={t('fav.emptyTours')} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 24 },
  header: { gap: 4, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted },
  separator: { height: 10 },
});
