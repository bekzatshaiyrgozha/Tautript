import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { useI18n } from '../i18n';
import { useStore, type FavoriteKind } from '../state/store';
import { colors } from '../theme';

export function HeartButton({ kind, id, size = 22, light = false }: { kind: FavoriteKind; id: string; size?: number; light?: boolean }) {
  const { t } = useI18n();
  const { isFavorite, toggleFavorite } = useStore();
  const active = isFavorite(kind, id);
  return (
    <Pressable
      onPress={() => toggleFavorite(kind, id)}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={t(active ? 'fav.remove' : 'fav.add')}
    >
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={size} color={active ? colors.heart : light ? '#FFFFFF' : colors.muted} />
    </Pressable>
  );
}
