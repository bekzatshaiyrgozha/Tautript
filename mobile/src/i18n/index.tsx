import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { Duration, Season } from '../data/types';
import { MONTHS, STRINGS, type StringKey } from './strings';
import { LANGUAGES, type Lang, type Localized } from './types';

export { LANGUAGES, type Lang, type Localized, type StringKey };

const STORAGE_KEY = 'tautrip:lang';
const NUMBER_LOCALE: Record<Lang, string> = { kk: 'ru-RU', ru: 'ru-RU', en: 'en-US' };

type I18n = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** UI text by key, with {placeholders} filled from `vars`. */
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
  /** Pick the current language from a Localized value. */
  loc: (value: Localized) => string;
  num: (value: number) => string;
  duration: (value: Duration) => string;
  season: (value: Season) => string;
};

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('kk');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved as Lang);
      })
      .catch(() => {});
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo<I18n>(() => {
    const t: I18n['t'] = (key, vars) => {
      let text = STRINGS[lang][key];
      if (vars) for (const [name, v] of Object.entries(vars)) text = text.replace(`{${name}}`, String(v));
      return text;
    };
    return {
      lang,
      setLang,
      t,
      loc: (v) => v[lang],
      num: (v) => v.toLocaleString(NUMBER_LOCALE[lang]),
      duration: (d) =>
        `${d.to ? `${d.from}–${d.to}` : d.from} ${t(d.unit === 'h' ? 'unit.hours' : 'unit.days')}`,
      season: (s) => (s === 'all' ? t('season.allYear') : `${MONTHS[lang][s.from - 1]} – ${MONTHS[lang][s.to - 1]}`),
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const i18n = useContext(I18nContext);
  if (!i18n) throw new Error('useI18n must be used inside <I18nProvider>');
  return i18n;
}
