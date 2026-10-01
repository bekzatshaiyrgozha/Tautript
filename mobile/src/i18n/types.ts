export type Lang = 'kk' | 'ru' | 'en';

/** A text in all three app languages. */
export type Localized = Record<Lang, string>;

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'kk', label: 'Қаз' },
  { code: 'ru', label: 'Рус' },
  { code: 'en', label: 'Eng' },
];
