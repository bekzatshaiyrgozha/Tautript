import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LANGUAGES, useI18n } from '../i18n';
import { colors, radius } from '../theme';
import { Segmented } from './Segmented';

/** Қаз / Рус / Eng. `compact` is the small version for the auth screens' top bar. */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();

  if (!compact) {
    return (
      <Segmented options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))} value={lang} onChange={setLang} />
    );
  }

  return (
    <View style={styles.row}>
      {LANGUAGES.map((l) => {
        const active = l.code === lang;
        return (
          <Pressable
            key={l.code}
            onPress={() => setLang(l.code)}
            style={[styles.item, active && styles.active]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.text, active && styles.textActive]}>{l.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: radius.pill, padding: 3 },
  item: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  active: { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  text: { fontSize: 13, fontWeight: '600', color: colors.muted },
  textActive: { color: colors.text },
});
