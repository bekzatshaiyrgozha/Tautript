import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';

export type Art = 'lake' | 'waterfall' | 'gorge' | 'lakes' | 'peak';

type Theme = { skyTop: string; skyBottom: string; far: string; mid: string; near: string; snow: string; sun: string };

const THEMES: Record<Art, Theme> = {
  lake: { skyTop: '#9CCBD6', skyBottom: '#F6E6C8', far: '#7FA3A8', mid: '#4E7B6E', near: '#2F5A4C', snow: '#FFFFFF', sun: '#FFE9A8' },
  waterfall: { skyTop: '#B7D8C9', skyBottom: '#EAF3E6', far: '#7DA595', mid: '#3F7461', near: '#25503F', snow: '#F2F8F4', sun: '#FFF6CF' },
  gorge: { skyTop: '#F2B987', skyBottom: '#FBE7C6', far: '#C98A63', mid: '#9C5F44', near: '#4E4A35', snow: '#FFF3E3', sun: '#FFF1C2' },
  lakes: { skyTop: '#86B7C7', skyBottom: '#DDEBE2', far: '#6B93A0', mid: '#3F6E63', near: '#1F4D40', snow: '#FFFFFF', sun: '#FFFFFF' },
  peak: { skyTop: '#2F5D7C', skyBottom: '#F3C9A0', far: '#6C8FA6', mid: '#3A6071', near: '#1D3B3A', snow: '#FFFFFF', sun: '#FFD9A0' },
};

const cap = (x: number, y: number, w: number, h = w * 0.9) =>
  `${x},${y} ${x - w},${y + h} ${x - w * 0.45},${y + h * 0.78} ${x},${y + h} ${x + w * 0.4},${y + h * 0.76} ${x + w},${y + h}`;

function Trees({ from, to, base, color, size = 9 }: { from: number; to: number; base: number; color: string; size?: number }) {
  const items = [];
  const step = size * 0.85;
  for (let x = from, i = 0; x <= to; x += step, i++) {
    const h = size * (1.2 + ((i * 37) % 5) * 0.12);
    items.push(<Polygon key={x} points={`${x},${base - h} ${x - size / 2},${base} ${x + size / 2},${base}`} fill={color} />);
  }
  return <>{items}</>;
}

/**
 * Illustrated mountain scene used instead of photos (the demo data has none).
 * Scales to any size (it crops like a photo), so use it as a card image or a hero.
 */
export function LandscapeArt({ art, style }: { art: Art; style?: StyleProp<ViewStyle> }) {
  const c = THEMES[art];
  const id = `art-${art}`;
  return (
    <View style={[styles.box, style]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={c.skyTop} />
            <Stop offset="1" stopColor={c.skyBottom} />
          </LinearGradient>
          <LinearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7FD1C7" />
            <Stop offset="1" stopColor="#2E8F86" />
          </LinearGradient>
        </Defs>
        <Rect width="200" height="120" fill={`url(#${id}-sky)`} />
        <Circle cx={art === 'peak' ? 168 : 38} cy={art === 'peak' ? 24 : 30} r={art === 'lakes' ? 9 : 13} fill={c.sun} opacity={0.9} />

        {art === 'peak' ? (
          <>
            <Path d="M0 84 L30 62 L52 76 L78 54 L104 78 L130 60 L160 78 L200 58 L200 120 L0 120 Z" fill={c.far} />
            <Polygon points="100,18 38,100 162,100" fill={c.mid} />
            <Polygon points="100,18 162,100 112,100 104,64" fill={c.near} opacity={0.55} />
            <Polygon points={cap(100, 18, 17, 24)} fill={c.snow} />
            <Path d="M0 98 L40 84 L80 96 L130 86 L200 100 L200 120 L0 120 Z" fill={c.near} />
            <Trees from={6} to={60} base={108} color="#122A2A" size={10} />
            <Trees from={140} to={196} base={110} color="#122A2A" size={11} />
          </>
        ) : art === 'gorge' ? (
          <>
            <Path d="M0 120 L0 30 L26 22 L46 52 L62 70 L78 120 Z" fill={c.mid} />
            <Path d="M200 120 L200 24 L172 20 L150 56 L132 76 L118 120 Z" fill={c.far} />
            <Path d="M0 120 L0 56 L22 50 L38 78 L52 120 Z" fill={c.near} opacity={0.75} />
            <Path d="M200 120 L200 62 L176 54 L160 82 L146 120 Z" fill="#7A4A36" opacity={0.8} />
            <Path d="M70 120 L92 78 L104 70 L116 80 L128 120 Z" fill="#C9D9C0" opacity={0.55} />
            <Path d="M78 120 Q100 96 122 120 Z" fill="#6FB7B0" />
            <Trees from={4} to={64} base={116} color="#2E4A2B" size={11} />
            <Trees from={142} to={196} base={116} color="#2E4A2B" size={11} />
          </>
        ) : (
          <>
            <Path d="M0 80 L25 55 L45 70 L70 40 L100 68 L130 45 L160 66 L185 50 L200 60 L200 120 L0 120 Z" fill={c.far} />
            <Polygon points={cap(70, 40, 12, 14)} fill={c.snow} />
            <Polygon points={cap(130, 45, 11, 13)} fill={c.snow} />
            <Polygon points={cap(25, 55, 8, 9)} fill={c.snow} />
            <Path d="M0 96 L30 76 L60 92 L96 70 L132 92 L168 74 L200 90 L200 120 L0 120 Z" fill={c.mid} />
            {art === 'waterfall' && (
              <>
                <Path d="M0 120 L0 60 L40 52 L58 78 L70 120 Z" fill={c.near} />
                <Path d="M200 120 L200 50 L150 46 L132 76 L122 120 Z" fill={c.near} />
                <Rect x="98" y="58" width="6" height="48" rx="3" fill="#F6FBFA" opacity={0.95} />
                <Rect x="106" y="66" width="3" height="40" rx="1.5" fill="#F6FBFA" opacity={0.7} />
                <Ellipse cx="102" cy="108" rx="20" ry="5" fill="#DFF3EE" opacity={0.85} />
                <Trees from={4} to={60} base={116} color="#173B2F" size={11} />
                <Trees from={136} to={196} base={116} color="#173B2F" size={11} />
              </>
            )}
            {(art === 'lake' || art === 'lakes') && (
              <>
                <Path d="M0 104 Q50 90 100 98 T200 96 L200 120 L0 120 Z" fill={c.near} />
                <Ellipse cx={art === 'lakes' ? 62 : 100} cy={art === 'lakes' ? 104 : 106} rx={art === 'lakes' ? 38 : 70} ry={art === 'lakes' ? 9 : 11} fill={`url(#${id}-water)`} />
                {art === 'lakes' && <Ellipse cx="150" cy="110" rx="34" ry="8" fill={`url(#${id}-water)`} />}
                <Path d={art === 'lakes' ? 'M36 104 H88 M130 110 H170' : 'M50 106 H150 M64 110 H136'} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth="1" />
                <Trees from={art === 'lakes' ? 2 : 6} to={art === 'lakes' ? 44 : 38} base={112} color="#123B30" size={11} />
                <Trees from={art === 'lakes' ? 168 : 164} to={198} base={114} color="#123B30" size={11} />
              </>
            )}
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({ box: { overflow: 'hidden' } });
