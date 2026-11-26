import type { Localized } from '../i18n/types';

/** Rental offer from a partner shop (demo data until the backend has /equipment). */
export type EquipmentItem = {
  id: string;
  name: Localized;
  pricePerDayKzt: number;
  shop: string;
  updated: string;
  url: string;
};

export const EQUIPMENT: EquipmentItem[] = [
  {
    id: 'poles',
    name: { kk: 'Трекинг таяқтары (жұп)', ru: 'Треккинговые палки (пара)', en: 'Trekking poles (pair)' },
    pricePerDayKzt: 1000,
    shop: 'Shop A',
    updated: '2026-10-12',
    url: 'https://example.com/equipment/poles',
  },
  {
    id: 'backpack',
    name: { kk: 'Рюкзак 40 л', ru: 'Рюкзак 40 л', en: 'Backpack 40 L' },
    pricePerDayKzt: 2500,
    shop: 'Shop A',
    updated: '2026-10-12',
    url: 'https://example.com/equipment/backpack',
  },
  {
    id: 'tent',
    name: { kk: 'Екі кісілік шатыр', ru: 'Двухместная палатка', en: '2-person tent' },
    pricePerDayKzt: 5000,
    shop: 'Shop B',
    updated: '2026-10-12',
    url: 'https://example.com/equipment/tent',
  },
  {
    id: 'sleeping-bag',
    name: { kk: 'Ұйықтайтын қап −10 °C', ru: 'Спальный мешок −10 °C', en: 'Sleeping bag −10 °C' },
    pricePerDayKzt: 3000,
    shop: 'Shop B',
    updated: '2026-10-12',
    url: 'https://example.com/equipment/sleeping-bag',
  },
  {
    id: 'crampons',
    name: { kk: 'Мұз кошкалары', ru: 'Ледовые кошки', en: 'Ice crampons' },
    pricePerDayKzt: 2000,
    shop: 'Shop C',
    updated: '2026-10-12',
    url: 'https://example.com/equipment/crampons',
  },
];
