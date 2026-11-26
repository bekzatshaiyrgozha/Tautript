import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '../theme';

type Props = { checked: boolean; onPress: () => void; label: string; round?: boolean; disabled?: boolean };

export function Checkbox({ checked, onPress, label, round = false, disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      style={[styles.box, round && styles.round, checked && styles.checked, disabled && styles.disabled]}
    >
      {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  round: { borderRadius: 11 },
  checked: { backgroundColor: colors.primary, borderColor: colors.primary },
  disabled: { opacity: 0.35 },
});
