import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type FavoriteKind = 'mountains' | 'routes';

type Profile = { avatarUri: string | null };
type Favorites = Record<FavoriteKind, string[]>;
type State = { profile: Profile; favorites: Favorites };

const STORAGE_KEY = 'tautrip:v1';
const INITIAL: State = {
  profile: { avatarUri: null },
  favorites: { mountains: [], routes: [] },
};

type Store = State & {
  setAvatar: (uri: string | null) => void;
  toggleFavorite: (kind: FavoriteKind, id: string) => void;
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
};

const StoreContext = createContext<Store | null>(null);

/** Profile photo and favorites, saved on the phone (AsyncStorage). */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<State>;
        setState({
          profile: { ...INITIAL.profile, ...saved.profile },
          favorites: { ...INITIAL.favorites, ...saved.favorites },
        });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  const setAvatar = useCallback((avatarUri: string | null) => {
    setState((s) => ({ ...s, profile: { ...s.profile, avatarUri } }));
  }, []);

  const toggleFavorite = useCallback((kind: FavoriteKind, id: string) => {
    setState((s) => {
      const list = s.favorites[kind];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      return { ...s, favorites: { ...s.favorites, [kind]: next } };
    });
  }, []);

  const isFavorite = useCallback(
    (kind: FavoriteKind, id: string) => state.favorites[kind].includes(id),
    [state.favorites],
  );

  const value = useMemo(
    () => ({ ...state, setAvatar, toggleFavorite, isFavorite }),
    [state, setAvatar, toggleFavorite, isFavorite],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
