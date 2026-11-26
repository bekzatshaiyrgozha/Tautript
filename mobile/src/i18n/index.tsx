import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { Duration, Season } from '../data/types';
import { MONTHS, STRINGS, type StringKey } from './strings';
import { LANGUAGES, type Lang, type Localized } from './types';

export { LANGUAGES, type Lang, type Localized, type StringKey };

const STORAGE_KEY = 'tautrip:lang';
const SHORT_MONTHS: Record<Lang, string[]> = {
  kk: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
  ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
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
  /** 6500 → "6 500 ₸" */
  money: (value: number) => string;
  /** ISO date → "12 Oct 2026" */
  date: (iso: string) => string;
  /** "1 day", "2 days" or "1–3 days" */
  dayRange: (min: number, max: number) => string;
  /** "from 9 000 ₸", or "price on request" when no company publishes one */
  priceFrom: (value: number | null) => string;
  /** ISO date → "28 Nov" */
  shortDate: (iso: string) => string;
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
      money: (v) => `${v.toLocaleString(NUMBER_LOCALE[lang])} ₸`,
      date: (iso) =>
        new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      dayRange: (min, max) =>
        min === max ? (min === 1 ? t('tours.oneDay') : t('tours.days', { n: min })) : t('tours.dayRange', { from: min, to: max }),
      priceFrom: (v) => (v === null ? t('offers.priceOnRequest') : t('offers.from', { price: `${v.toLocaleString(NUMBER_LOCALE[lang])} ₸` })),
      shortDate: (iso) => {
        const [, m, d] = iso.split('-').map(Number);
        return `${d} ${SHORT_MONTHS[lang][m - 1]}`;
      },
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
