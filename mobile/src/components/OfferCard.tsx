import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { COMPANIES, upcomingDates, type Offer } from '../data/tours';
import { useI18n } from '../i18n';
import { colors, radius } from '../theme';
import { PrimaryButton } from './PrimaryButton';

const SHOWN_DATES = 4;

/** One company's offer for a place: price, dates, meeting point and a link to its page. */
export function OfferCard({ offer }: { offer: Offer }) {
  const { t, money, shortDate } = useI18n();
  const company = COMPANIES[offer.company];
  const upcoming = upcomingDates(offer);
  const group = offer.priceNote?.startsWith('group:') ? Number(offer.priceNote.slice(6)) : null;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={[styles.logo, { backgroundColor: company.color }]}>
          <Text style={styles.logoText}>{company.name[0]}</Text>
        </View>
        <View style={styles.headText}>
          <Text style={styles.company}>{company.name}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {offer.title}
          </Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.price}>{offer.priceKzt !== null ? money(offer.priceKzt) : '—'}</Text>
          <Text style={styles.priceNote}>
            {offer.priceKzt === null
              ? t('offers.priceOnRequest')
              : group
                ? t('offers.group', { n: group })
                : t('offers.perPerson')}
          </Text>
        </View>
      </View>

      <View style={styles.tags}>
        {offer.durationLabel && (
          <View style={styles.tag}>
            <Ionicons name="time-outline" size={13} color={colors.primaryDark} />
            <Text style={styles.tagText} numberOfLines={1}>
              {offer.durationLabel}
            </Text>
          </View>
        )}
        {group && (
          <View style={styles.tag}>
            <Ionicons name="person-outline" size={13} color={colors.primaryDark} />
            <Text style={styles.tagText}>{t('offers.private')}</Text>
          </View>
        )}
      </View>

      <View style={styles.dates}>
        <Ionicons name="calendar-outline" size={16} color={colors.muted} />
        {upcoming.length > 0 ? (
          <View style={styles.dateRow}>
            {upcoming.slice(0, SHOWN_DATES).map((d) => (
              <View key={d} style={styles.date}>
                <Text style={styles.dateText}>{shortDate(d)}</Text>
              </View>
            ))}
            {upcoming.length > SHOWN_DATES && (
              <Text style={styles.more}>{t('offers.more', { count: upcoming.length - SHOWN_DATES })}</Text>
            )}
          </View>
        ) : (
          <Text style={styles.noDates}>{t(offer.dates.length ? 'offers.noUpcoming' : 'offers.dateOnRequest')}</Text>
        )}
      </View>

      {offer.meetingPoint && (
        <View style={styles.meeting}>
          <Ionicons name="location-outline" size={16} color={colors.muted} />
          <Text style={styles.meetingText} numberOfLines={2}>
            {offer.meetingPoint}
          </Text>
        </View>
      )}

      <PrimaryButton label={t('tours.visit')} style={styles.button} onPress={() => Linking.openURL(offer.url)} />
      <Text style={styles.checked}>{t('offers.checked', { site: company.site, date: shortDate(offer.checkedAt) })}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    gap: 12,
    shadowColor: '#0F2A22',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  logo: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  headText: { flex: 1, gap: 2 },
  company: { fontSize: 15, fontWeight: '800', color: colors.text },
  title: { fontSize: 13, lineHeight: 18, color: colors.muted },
  priceBox: { alignItems: 'flex-end', maxWidth: 110 },
  price: { fontSize: 18, fontWeight: '800', color: colors.primaryDark },
  priceNote: { fontSize: 11, color: colors.muted, textAlign: 'right' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: colors.primaryDark, flexShrink: 1 },
  dates: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateRow: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  date: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  dateText: { fontSize: 12, fontWeight: '700', color: colors.text },
  more: { fontSize: 12, color: colors.muted },
  noDates: { flex: 1, fontSize: 13, color: colors.muted },
  meeting: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  meetingText: { flex: 1, fontSize: 12, lineHeight: 17, color: colors.muted },
  button: { minHeight: 44 },
  checked: { fontSize: 11, color: colors.placeholder, textAlign: 'center', marginTop: -4 },
});
