import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { colors } from '../theme';

const PHONE = { width: 390, height: 844 }; // iPhone 14/15

/**
 * Web only: on a wide screen the app is shown inside an iPhone frame on a soft mountain
 * backdrop, so a link opened on a computer looks like a finished product.
 * On iOS (and on a phone browser) it renders the children as is.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const window = useWindowDimensions();
  if (Platform.OS !== 'web' || window.width < 600) return <>{children}</>;

  const height = Math.min(PHONE.height, window.height - 48);

  return (
    <View style={styles.desk}>
      <Backdrop />
      <View style={styles.row}>
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
    </View>
  );
}

/** Soft green sky with two mountain ridges along the bottom edge. */
function Backdrop() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice">
        <Defs>
          <LinearGradient id="desk-sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#E6F0EA" />
            <Stop offset="1" stopColor="#C4DDCF" />
          </LinearGradient>
        </Defs>
        <Rect width="1000" height="600" fill="url(#desk-sky)" />
        <Path d="M0 470 L120 380 L230 440 L360 340 L500 450 L640 360 L780 440 L900 370 L1000 430 L1000 600 L0 600 Z" fill="#B5D3C1" />
        <Path d="M0 530 L150 460 L300 520 L470 440 L620 520 L800 450 L1000 530 L1000 600 L0 600 Z" fill="#8FBBA3" />
      </Svg>
    </View>
  );
}

// A CSS transform makes `position: fixed` children (sheets) stay inside the phone
const containFixed = { transform: [{ translateZ: 0 }] } as unknown as ViewStyle;

const styles = StyleSheet.create({
  desk: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5E6DC' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  phone: {
    width: PHONE.width,
    borderRadius: 54,
    borderWidth: 12,
    borderColor: '#111111',
    backgroundColor: colors.card,
    overflow: 'hidden',
    shadowColor: '#0B1F18',
    shadowOpacity: 0.35,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
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
