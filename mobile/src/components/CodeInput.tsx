import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius } from '../theme';

const LENGTH = 6;

type Props = { value: string; onChange: (code: string) => void; error?: boolean; autoFocus?: boolean };

/** 6 boxes (3 + 3) over one hidden input; iOS can fill the code from Messages/Mail. */
export function CodeInput({ value, onChange, error = false, autoFocus = true }: Props) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.split('');

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.row}>
      {Array.from({ length: LENGTH }, (_, i) => {
        const active = i === Math.min(value.length, LENGTH - 1);
        return (
          <View key={i} style={[styles.box, i === 3 && styles.gap, active && styles.active, error && styles.error]}>
            <Text style={styles.digit}>{digits[i] ?? ''}</Text>
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={LENGTH}
        autoFocus={autoFocus}
        caretHidden
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  box: {
    flex: 1,
    maxWidth: 48,
    aspectRatio: 0.9,
    borderRadius: radius.md,
    backgroundColor: colors.codeBox,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  gap: { marginLeft: 12 },
  active: { borderColor: colors.primary, backgroundColor: colors.card },
  error: { borderColor: colors.error },
  digit: { fontSize: 24, fontWeight: '700', color: colors.text },
  hiddenInput: { position: 'absolute', width: '100%', height: '100%', opacity: 0.01 },
});
