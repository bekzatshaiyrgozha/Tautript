import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { passwordForgot } from '../../api/auth';
import { AuthScreen } from '../../components/AuthScreen';
import { CodeInput } from '../../components/CodeInput';
import { PasswordStrength } from '../../components/PasswordStrength';
import { TextField } from '../../components/TextField';
import { useI18n, type StringKey } from '../../i18n';
import { useAuth } from '../../state/auth';
import { authErrorKey, isValidEmail } from '../../state/authErrors';
import { colors, radius } from '../../theme';

/** Forgot password: email → code + new password → signed in. */
export default function ForgotScreen() {
  const { t } = useI18n();
  const { resetPassword } = useAuth();

  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<StringKey | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setError(null);
    setSubmitting(true);
    try {
      await action();
    } catch (e) {
      setError(authErrorKey(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'reset') {
    return (
      <AuthScreen
        onBack={() => setStep('email')}
        title={t('forgot.title')}
        subtitle={
          <Text style={styles.subtitle}>
            {t('signup.codeSent')}
            {'\n'}
            <Text style={styles.muted}>{email.trim()}</Text>
          </Text>
        }
        error={error && t(error)}
        submitLabel={t('forgot.save')}
        submitting={submitting}
        canSubmit={code.length === 6 && password.length >= 8}
        onSubmit={() => run(() => resetPassword(email.trim(), code, password))}
        buttonAtBottom
      >
        <Text style={styles.label}>{t('signup.enterCode')}</Text>
        <CodeInput value={code} onChange={setCode} error={error !== null} />
        {devCode && (
          <View style={styles.devBox}>
            <Ionicons name="construct-outline" size={16} color="#7A5A00" />
            <Text style={styles.devText}>{t('signup.devCode', { code: devCode })}</Text>
          </View>
        )}
        <TextField
          label={t('forgot.newPassword')}
          icon="lock-closed-outline"
          value={password}
          onChangeText={setPassword}
          secret
          placeholder="••••••••"
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          below={<PasswordStrength password={password} />}
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      onBack={() => router.back()}
      title={t('forgot.title')}
      subtitle={t('forgot.subtitle')}
      error={error && t(error)}
      submitLabel={t('forgot.send')}
      submitting={submitting}
      canSubmit={isValidEmail(email)}
      onSubmit={() =>
        run(async () => {
          const response = await passwordForgot(email.trim());
          setDevCode(response.dev_code);
          setStep('reset');
        })
      }
      buttonAtBottom
    >
      <TextField
        label={t('auth.email')}
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="example@mail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 17, color: colors.text, lineHeight: 24 },
  muted: { color: colors.muted },
  label: { fontSize: 17, color: colors.text },
  devBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF1D6',
    borderRadius: radius.md,
    padding: 10,
  },
  devText: { flex: 1, fontSize: 13, color: '#7A5A00' },
});
