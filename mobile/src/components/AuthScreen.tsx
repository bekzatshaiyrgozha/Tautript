import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '../i18n';
import { colors, radius } from '../theme';
import { LanguageSwitcher } from './LanguageSwitcher';
import { StepBar } from './StepBar';

type Props = {
  title: string;
  subtitle?: ReactNode;
  /** Back arrow (top left); hidden when not given */
  onBack?: () => void;
  /** Sign-up progress 1..3 */
  step?: number;
  error?: string | null;
  submitLabel: string;
  submitting?: boolean;
  /** Grey button until the form is filled in */
  canSubmit?: boolean;
  onSubmit: () => void;
  /** Push the button to the bottom of the screen (sign-up steps) */
  buttonAtBottom?: boolean;
  footer?: ReactNode;
  children: ReactNode;
};

/** Layout of the Sign in / Sign up / Reset screens, following the Figma wireframes. */
export function AuthScreen({
  title,
  subtitle,
  onBack,
  step,
  error,
  submitLabel,
  submitting = false,
  canSubmit = true,
  onSubmit,
  buttonAtBottom = false,
  footer,
  children,
}: Props) {
  const { t } = useI18n();
  const disabled = submitting || !canSubmit;

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            {onBack ? (
              <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('common.back')}>
                <Ionicons name="chevron-back" size={28} color={colors.text} />
              </Pressable>
            ) : (
              <View />
            )}
            <LanguageSwitcher compact />
          </View>

          {step !== undefined && <StepBar step={step} />}

          <View style={styles.heading}>
            <Text style={styles.title}>{title}</Text>
            {typeof subtitle === 'string' ? <Text style={styles.subtitle}>{subtitle}</Text> : subtitle}
          </View>

          {error && (
            <View style={styles.errorBox} accessibilityRole="alert">
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>{children}</View>

          {buttonAtBottom && <View style={styles.flex} />}

          <Pressable
            onPress={onSubmit}
            disabled={disabled}
            style={({ pressed }) => [styles.button, disabled && styles.buttonDisabled, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
          >
            {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{submitLabel}</Text>}
          </Pressable>

          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.card },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24, gap: 24 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 36 },
  heading: { gap: 6 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 17, color: colors.muted },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDECEA',
    borderRadius: radius.md,
    padding: 12,
  },
  errorText: { flex: 1, fontSize: 14, color: colors.error, fontWeight: '600' },
  form: { gap: 20 },
  button: {
    height: 52,
    width: '85%',
    alignSelf: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonDisabled: { backgroundColor: colors.disabled, shadowOpacity: 0.08 },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
