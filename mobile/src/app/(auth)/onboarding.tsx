import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { MountainThumb } from '../../components/MountainThumb';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useI18n } from '../../i18n';
import { markOnboarded } from '../../state/onboarding';
import { colors } from '../../theme';

const SLIDES = [
  { icon: 'map-outline', title: 'onb.title1', text: 'onb.text1' },
  { icon: 'checkbox-outline', title: 'onb.title2', text: 'onb.text2' },
] as const;

export default function OnboardingScreen() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  const finish = async () => {
    await markOnboarded();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Pressable onPress={finish} hitSlop={10}>
          <Text style={styles.skip}>{t('onb.skip')}</Text>
        </Pressable>
        <LanguageSwitcher compact />
      </View>

      <View style={styles.center}>
        <View style={styles.illustration}>
          <MountainThumb size={120} />
          <View style={styles.badge}>
            <Ionicons name={slide.icon} size={26} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.title}>{t(slide.title)}</Text>
        <Text style={styles.text}>{t(slide.text)}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <PrimaryButton
          label={t(last ? 'onb.start' : 'onb.next')}
          style={styles.button}
          onPress={last ? finish : () => setIndex(index + 1)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.card, paddingHorizontal: 24 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 36 },
  skip: { fontSize: 15, fontWeight: '600', color: colors.primary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  illustration: { marginBottom: 16 },
  badge: {
    position: 'absolute',
    right: -14,
    bottom: -14,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, textAlign: 'center' },
  text: { fontSize: 16, lineHeight: 24, color: colors.muted, textAlign: 'center' },
  bottom: { gap: 20, paddingBottom: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
  button: { width: '85%', alignSelf: 'center' },
});
