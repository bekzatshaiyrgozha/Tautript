import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ReactNode, type Ref } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useI18n } from '../i18n';
import { colors, radius } from '../theme';

type Props = TextInputProps & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  /** Password field with a show/hide button */
  secret?: boolean;
  /** Shown under the input (e.g. password strength) */
  below?: ReactNode;
  ref?: Ref<TextInput>;
};

/** Rounded input with a label above, as in the wireframes. */
export function TextField({ label, icon, error, secret = false, below, style, ref, ...input }: Props) {
  const { t } = useI18n();
  const [hidden, setHidden] = useState(secret);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, focused && styles.boxFocused, error ? styles.boxError : null]}>
        {icon && <Ionicons name={icon} size={18} color={colors.muted} />}
        <TextInput
          {...input}
          ref={ref}
          secureTextEntry={hidden}
          placeholderTextColor={colors.placeholder}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
        {secret && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t(hidden ? 'auth.showPassword' : 'auth.hidePassword')}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>
      {below}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 15, color: colors.text },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.card,
  },
  boxFocused: { borderColor: colors.primary, borderWidth: 1.5 },
  boxError: { borderColor: colors.error },
  input: { flex: 1, height: '100%', fontSize: 16, color: colors.text },
  error: { fontSize: 13, color: colors.error, marginLeft: 18 },
});
