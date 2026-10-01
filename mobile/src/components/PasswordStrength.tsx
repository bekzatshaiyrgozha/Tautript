import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../i18n';
import { passwordStrength } from '../state/authErrors';
import { colors } from '../theme';

const COLORS = ['', colors.error, '#E0A030', '#5CC46C'];

export function PasswordStrength({ password }: { password: string }) {
  const { t } = useI18n();
  const level = passwordStrength(password);
  if (level === 0) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[styles.segment, i <= level && { backgroundColor: COLORS[level] }]} />
        ))}
      </View>
      <Text style={[styles.label, { color: COLORS[level] }]}>{t(`signup.strength${level}`)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4, paddingHorizontal: 4 },
  row: { flexDirection: 'row', gap: 8 },
  segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border },
  label: { fontSize: 12, fontWeight: '600' },
});
