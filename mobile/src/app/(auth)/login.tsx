import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type TextInput } from 'react-native';

import { AuthScreen } from '../../components/AuthScreen';
import { TextField } from '../../components/TextField';
import { useI18n, type StringKey } from '../../i18n';
import { useAuth } from '../../state/auth';
import { authErrorKey, isValidEmail } from '../../state/authErrors';
import { colors, radius } from '../../theme';

export default function LoginScreen() {
  const { t } = useI18n();
  const { signIn } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [serverError, setServerError] = useState<StringKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [socialNotice, setSocialNotice] = useState(false);

  const submit = async () => {
    setServerError(null);
    if (!isValidEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setServerError(authErrorKey(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      error={serverError && t(serverError)}
      submitLabel={t('auth.loginTitle')}
      submitting={submitting}
      canSubmit={email.trim().length > 0 && password.length > 0}
      onSubmit={submit}
      footer={
        <>
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>{t('auth.orContinue')}</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.social}>
            <Pressable style={[styles.socialButton, styles.facebook]} onPress={() => setSocialNotice(true)}>
              <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
              <Text style={styles.socialText}>{t('auth.facebook')}</Text>
            </Pressable>
            <Pressable style={[styles.socialButton, styles.apple]} onPress={() => setSocialNotice(true)}>
              <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
              <Text style={styles.socialText}>{t('auth.apple')}</Text>
            </Pressable>
            {socialNotice && <Text style={styles.notice}>{t('auth.socialSoon')}</Text>}
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>{t('auth.noAccount')}</Text>
            <Pressable onPress={() => router.push('/register')} hitSlop={8}>
              <Text style={styles.link}>{t('auth.toRegister')}</Text>
            </Pressable>
          </View>
        </>
      }
    >
      <TextField
        label={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        error={emailError ? t('auth.errEmailInvalid') : undefined}
        placeholder="example@mail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <View>
        <TextField
          ref={passwordRef}
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          secret
          placeholder="••••••••"
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Pressable onPress={() => router.push('/forgot')} hitSlop={8} style={styles.forgot}>
          <Text style={styles.forgotText}>{t('auth.forgot')}</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', marginTop: 10, marginRight: 4 },
  forgotText: { fontSize: 13, color: colors.muted },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 15, color: colors.text },
  social: { gap: 12 },
  socialButton: {
    height: 46,
    width: '85%',
    alignSelf: 'center',
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  facebook: { backgroundColor: '#1877F2' },
  apple: { backgroundColor: '#000000' },
  socialText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  notice: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  signupRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 6 },
  signupText: { fontSize: 15, color: colors.text },
  link: { fontSize: 15, color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' },
});
