import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type TextInput } from 'react-native';

import { PREFERENCES, signupStart, signupVerify, type Preference } from '../../api/auth';
import { AuthScreen } from '../../components/AuthScreen';
import { BottomSheet } from '../../components/BottomSheet';
import { Chip } from '../../components/Chip';
import { CodeInput } from '../../components/CodeInput';
import { PasswordStrength } from '../../components/PasswordStrength';
import { TextField } from '../../components/TextField';
import { useI18n, type StringKey } from '../../i18n';
import { useAuth } from '../../state/auth';
import {
  authErrorKey,
  errorCode,
  formatBirthdayInput,
  isValidEmail,
  isValidTag,
  parseBirthday,
} from '../../state/authErrors';
import { colors, radius } from '../../theme';

type Step = 1 | 2 | 3;
type FieldErrors = Partial<Record<'email' | 'tag' | 'password' | 'terms' | 'name' | 'birthday', StringKey>>;

const RESEND_SECONDS = 60;

/** Sign-up in 3 steps: account → email code → profile. */
export default function RegisterScreen() {
  const { t } = useI18n();
  const { completeSignup } = useAuth();
  const tagRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<StringKey | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Step 1
  const [email, setEmail] = useState('');
  const [tag, setTag] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  // Step 2
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [signupToken, setSignupToken] = useState<string | null>(null);
  // Step 3
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [preferences, setPreferences] = useState<Preference[]>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const goTo = (next: Step) => {
    setError(null);
    setFieldErrors({});
    setStep(next);
  };

  const back = () => {
    if (step === 1) router.back();
    else goTo(1); // the code is single-use, so step 3 also starts over
  };

  const sendCode = async () => {
    const response = await signupStart(email.trim(), tag.trim());
    setDevCode(response.dev_code);
    setCode('');
    setResendIn(RESEND_SECONDS);
  };

  const run = async (action: () => Promise<void>) => {
    setError(null);
    setSubmitting(true);
    try {
      await action();
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Step 1: email, tag, password, terms → code is sent
  const submitAccount = () => {
    const errors: FieldErrors = {};
    if (!isValidEmail(email)) errors.email = 'auth.errEmailInvalid';
    if (!isValidTag(tag)) errors.tag = 'auth.errTagInvalid';
    if (password.length < 8) errors.password = 'auth.errPasswordShort';
    if (!terms) errors.terms = 'signup.errTerms';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    run(async () => {
      try {
        await sendCode();
        goTo(2);
      } catch (e) {
        const codeName = errorCode(e);
        if (codeName === 'email_taken') setFieldErrors({ email: 'auth.errEmailTaken' });
        else if (codeName === 'tag_taken') setFieldErrors({ tag: 'auth.errTagTaken' });
        else setError(authErrorKey(e));
      }
    });
  };

  // ---- Step 2: 6-digit code → signup token
  const submitCode = (value = code) => {
    if (value.length !== 6) {
      setError('signup.errCodeIncomplete');
      return;
    }
    run(async () => {
      try {
        const response = await signupVerify(email.trim(), value);
        setSignupToken(response.signup_token);
        goTo(3);
      } catch (e) {
        setError(authErrorKey(e));
        setCode('');
      }
    });
  };

  const changeCode = (value: string) => {
    setCode(value);
    if (value.length === 6 && !submitting) submitCode(value);
  };

  const resend = () =>
    run(async () => {
      try {
        await sendCode();
      } catch (e) {
        setError(authErrorKey(e));
      }
    });

  // ---- Step 3: profile → account is created and the user is signed in
  const submitProfile = () => {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = 'auth.errNameRequired';
    const isoBirthday = birthday ? parseBirthday(birthday) : null;
    if (birthday && !isoBirthday) errors.birthday = 'signup.errBirthday';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || !signupToken) return;

    run(async () => {
      try {
        await completeSignup({
          signup_token: signupToken,
          tag: tag.trim(),
          password,
          name: name.trim(),
          birthday: isoBirthday,
          gender,
          preferences,
        });
        // The root layout switches to the app once signed in
      } catch (e) {
        const codeName = errorCode(e);
        if (codeName === 'invalid_signup_token' || codeName === 'tag_taken' || codeName === 'email_taken') {
          goTo(1);
        }
        setError(authErrorKey(e));
      }
    });
  };

  const togglePreference = (p: Preference) =>
    setPreferences((list) => (list.includes(p) ? list.filter((x) => x !== p) : [...list, p]));

  const fieldError = (key: keyof FieldErrors) => (fieldErrors[key] ? t(fieldErrors[key]) : undefined);

  if (step === 2) {
    return (
      <AuthScreen
        step={2}
        onBack={back}
        title={t('signup.codeTitle')}
        subtitle={
          <Text style={styles.subtitle}>
            {t('signup.codeSent')}
            {'\n'}
            <Text style={styles.email}>{email.trim()}</Text>
          </Text>
        }
        error={error && t(error)}
        submitLabel={t('signup.next')}
        submitting={submitting}
        canSubmit={code.length === 6}
        onSubmit={() => submitCode()}
        buttonAtBottom
      >
        <Text style={styles.label}>{t('signup.enterCode')}</Text>
        <CodeInput value={code} onChange={changeCode} error={error !== null} />
        {devCode && (
          <View style={styles.devBox}>
            <Ionicons name="construct-outline" size={16} color="#7A5A00" />
            <Text style={styles.devText}>{t('signup.devCode', { code: devCode })}</Text>
          </View>
        )}
        <Pressable onPress={resend} disabled={resendIn > 0 || submitting} hitSlop={8} style={styles.resend}>
          <Text style={[styles.link, resendIn > 0 && styles.linkDisabled]}>
            {resendIn > 0 ? t('signup.resendIn', { seconds: resendIn }) : t('signup.resend')}
          </Text>
        </Pressable>
      </AuthScreen>
    );
  }

  if (step === 3) {
    return (
      <AuthScreen
        step={3}
        onBack={back}
        title={t('signup.title')}
        error={error && t(error)}
        submitLabel={t('signup.finish')}
        submitting={submitting}
        canSubmit={name.trim().length > 0}
        onSubmit={submitProfile}
        buttonAtBottom
      >
        <TextField
          label={t('signup.fullName')}
          value={name}
          onChangeText={setName}
          error={fieldError('name')}
          placeholder={t('signup.fullNamePlaceholder')}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
        />
        <TextField
          label={t('signup.birthday')}
          value={birthday}
          onChangeText={(text) => setBirthday(formatBirthdayInput(text))}
          error={fieldError('birthday')}
          placeholder={t('signup.birthdayPlaceholder')}
          keyboardType="number-pad"
          maxLength={10}
        />
        <View style={styles.group}>
          <Text style={styles.label}>{t('signup.gender')}</Text>
          <View style={styles.chips}>
            {(['male', 'female'] as const).map((g) => (
              <Chip
                key={g}
                label={t(g === 'male' ? 'signup.male' : 'signup.female')}
                selected={gender === g}
                onPress={() => setGender((current) => (current === g ? null : g))}
              />
            ))}
          </View>
        </View>
        <View style={styles.group}>
          <Text style={styles.label}>{t('signup.preferences')}</Text>
          <View style={styles.chips}>
            {PREFERENCES.map((p) => (
              <Chip
                key={p}
                label={t(`pref.${p}`)}
                selected={preferences.includes(p)}
                onPress={() => togglePreference(p)}
              />
            ))}
          </View>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      step={1}
      onBack={back}
      title={t('signup.title')}
      error={error && t(error)}
      submitLabel={t('signup.next')}
      submitting={submitting}
      canSubmit={email.trim().length > 0 && tag.trim().length > 0 && password.length > 0 && terms}
      onSubmit={submitAccount}
      buttonAtBottom
      overlay={
        <BottomSheet visible={termsOpen} title={t('signup.termsTitle')} onClose={() => setTermsOpen(false)}>
          <Text style={styles.termsBody}>{t('signup.termsText')}</Text>
          <Pressable
            style={styles.sheetButton}
            onPress={() => {
              setTerms(true);
              setTermsOpen(false);
            }}
          >
            <Text style={styles.sheetButtonText}>OK</Text>
          </Pressable>
        </BottomSheet>
      }
    >
      <TextField
        label={t('auth.email')}
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        error={fieldError('email')}
        placeholder="example@mail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => tagRef.current?.focus()}
      />
      <TextField
        ref={tagRef}
        label={t('signup.tag')}
        icon="at"
        value={tag}
        onChangeText={(text) => setTag(text.replace(/\s/g, ''))}
        error={fieldError('tag')}
        placeholder="yournickname"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username-new"
        textContentType="username"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef}
        label={t('signup.createPassword')}
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        error={fieldError('password')}
        secret
        placeholder="••••••••"
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        below={<PasswordStrength password={password} />}
      />

      <View>
        <Pressable
          onPress={() => setTerms((v) => !v)}
          style={styles.termsRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: terms }}
        >
          <Ionicons
            name={terms ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={terms ? colors.primary : colors.inputBorder}
          />
          <Text style={styles.termsText}>
            {t('signup.termsPrefix')}
            <Text style={styles.termsLink} onPress={() => setTermsOpen(true)}>
              {t('signup.termsLink')}
            </Text>
            {t('signup.termsSuffix')}
          </Text>
        </Pressable>
        {fieldErrors.terms && <Text style={styles.termsError}>{t(fieldErrors.terms)}</Text>}
      </View>

    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 17, color: colors.text, lineHeight: 24 },
  email: { color: colors.muted },
  label: { fontSize: 17, color: colors.text },
  group: { gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  devBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF1D6',
    borderRadius: radius.md,
    padding: 10,
  },
  devText: { flex: 1, fontSize: 13, color: '#7A5A00' },
  resend: { alignSelf: 'center' },
  link: { fontSize: 15, color: colors.primary, fontWeight: '600' },
  linkDisabled: { color: colors.muted, fontWeight: '400' },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  termsText: { flex: 1, fontSize: 14, color: colors.text },
  termsLink: { color: colors.primary, fontWeight: '600' },
  termsError: { fontSize: 13, color: colors.error, marginTop: 6, marginLeft: 32 },
  termsBody: { fontSize: 15, lineHeight: 22, color: colors.text },
  sheetButton: {
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
