import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Checkbox } from '../components/Checkbox';
import { Chip } from '../components/Chip';
import { CHECKLIST_PROFILES, checklistFor, type ChecklistProfile } from '../data/checklist';
import { useI18n } from '../i18n';
import { useStore } from '../state/store';
import { colors, radius } from '../theme';

export default function ChecklistScreen() {
  const { t, loc } = useI18n();
  const { checked, toggleChecked, clearChecked } = useStore();
  const params = useLocalSearchParams<{ profile?: string }>();
  const [profile, setProfile] = useState<ChecklistProfile>(
    CHECKLIST_PROFILES.some((p) => p.key === params.profile) ? (params.profile as ChecklistProfile) : 'autumn',
  );

  const groups = checklistFor(profile);
  const ids = groups.flatMap((g) => g.items.map((i) => i.id));
  const done = ids.filter((id) => checked.includes(id)).length;

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <Stack.Screen options={{ title: t('checklist.title') }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chips}>
          {CHECKLIST_PROFILES.map((p) => (
            <Chip key={p.key} label={t(p.labelKey)} selected={profile === p.key} onPress={() => setProfile(p.key)} />
          ))}
        </View>

        <View style={styles.progress}>
          <Text style={styles.progressText}>{t('checklist.progress', { done, total: ids.length })}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${ids.length ? (done / ids.length) * 100 : 0}%` }]} />
          </View>
        </View>

        {groups.map((group) => (
          <View key={group.id} style={styles.group}>
            <Text style={styles.groupTitle}>{t(group.titleKey)}</Text>
            {group.items.map((item) => {
              const isChecked = checked.includes(item.id);
              return (
                <Pressable
                  key={item.id}
                  style={styles.item}
                  onPress={() => toggleChecked(item.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isChecked }}
                >
                  <Checkbox round checked={isChecked} onPress={() => toggleChecked(item.id)} label={loc(item.label)} />
                  <Text style={[styles.itemText, isChecked && styles.itemDone]}>{loc(item.label)}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        <Pressable onPress={() => clearChecked(ids)} hitSlop={8} accessibilityRole="button">
          <Text style={styles.reset}>{t('checklist.reset')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  progress: { gap: 6 },
  progressText: { fontSize: 13, color: colors.muted },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.primary },
  group: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 4 },
  groupTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  itemText: { flex: 1, fontSize: 15, color: colors.text },
  itemDone: { color: colors.muted, textDecorationLine: 'line-through' },
  reset: { textAlign: 'center', fontSize: 14, fontWeight: '600', color: colors.primary, paddingVertical: 8 },
});
