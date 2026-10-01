import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions, type ViewStyle } from 'react-native';

import { colors } from '../theme';

const PHONE = { width: 390, height: 844 }; // iPhone 14/15

/**
 * Web preview only: shows the app inside an iPhone frame on a wide screen,
 * so it looks like the app and not like a website. On iOS it renders children as is.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const window = useWindowDimensions();
  if (Platform.OS !== 'web' || window.width < 600) return <>{children}</>;

  const height = Math.min(PHONE.height, window.height - 48);
  return (
    <View style={styles.desk}>
      <View style={[styles.phone, { height }, containFixed]}>
        <View style={styles.statusBar}>
          <Text style={styles.time}>9:41</Text>
          <View style={styles.island} />
          <View style={styles.icons}>
            <Ionicons name="cellular" size={15} color={colors.text} />
            <Ionicons name="wifi" size={15} color={colors.text} />
            <Ionicons name="battery-full" size={20} color={colors.text} />
          </View>
        </View>
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

// A CSS transform makes `position: fixed` children (sheets) stay inside the phone
const containFixed = { transform: [{ translateZ: 0 }] } as unknown as ViewStyle;

const styles = StyleSheet.create({
  desk: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E4E7EB' },
  phone: {
    width: PHONE.width,
    borderRadius: 54,
    borderWidth: 12,
    borderColor: '#111111',
    backgroundColor: colors.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
  },
  statusBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    backgroundColor: colors.card,
  },
  time: { fontSize: 16, fontWeight: '600', color: colors.text, width: 60 },
  island: { width: 110, height: 32, borderRadius: 16, backgroundColor: '#111111' },
  icons: { flexDirection: 'row', alignItems: 'center', gap: 5, width: 60, justifyContent: 'flex-end' },
  screen: { flex: 1 },
});
