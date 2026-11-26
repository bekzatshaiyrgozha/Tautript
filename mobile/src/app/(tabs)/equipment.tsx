import { FlatList, Linking, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../components/PrimaryButton';
import { EQUIPMENT } from '../../data/equipment';
import { useI18n } from '../../i18n';
import { colors, radius } from '../../theme';

export default function EquipmentScreen() {
  const { t, loc, money, date } = useI18n();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={EQUIPMENT}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('equipment.title')}</Text>
            <Text style={styles.subtitle}>{t('equipment.subtitle')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.top}>
              <Text style={styles.name}>{loc(item.name)}</Text>
              <Text style={styles.price}>
                {money(item.pricePerDayKzt)} {t('equipment.perDay')}
              </Text>
            </View>
            <Text style={styles.source}>{t('equipment.source', { shop: item.shop, date: date(item.updated) })}</Text>
            <PrimaryButton
              label={t('tours.visit')}
              variant="outline"
              style={styles.button}
              onPress={() => Linking.openURL(item.url)}
            />
          </View>
        )}
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
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 6 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  name: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  price: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
  source: { fontSize: 12, color: colors.muted },
  button: { minHeight: 40, marginTop: 6 },
});
