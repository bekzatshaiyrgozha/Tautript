import type { StringKey } from '../i18n';
import type { Localized } from '../i18n/types';

export type ChecklistProfile = 'autumn' | 'summer' | 'winter';
export type ChecklistGroup = { id: string; titleKey: StringKey; items: { id: string; label: Localized }[] };

export const CHECKLIST_PROFILES: { key: ChecklistProfile; labelKey: StringKey }[] = [
  { key: 'autumn', labelKey: 'checklist.autumn' },
  { key: 'summer', labelKey: 'checklist.summer' },
  { key: 'winter', labelKey: 'checklist.winter' },
];

const item = (id: string, kk: string, ru: string, en: string) => ({ id, label: { kk, ru, en } });

const CLOTHING = [
  item('boots', 'Трекинг аяқ киімі', 'Трекинговая обувь', 'Trekking boots'),
  item('fleece', 'Флис және жел өткізбейтін күртеше', 'Флис и ветровка', 'Fleece and windbreaker'),
  item('gloves', 'Қалпақ және қолғап', 'Шапка и перчатки', 'Hat and gloves'),
];
const GEAR = [
  item('backpack', 'Рюкзак 20–30 л', 'Рюкзак 20–30 л', 'Backpack 20–30 L'),
  item('headlamp', 'Бас шамы', 'Налобный фонарь', 'Headlamp'),
  item('poles', 'Трекинг таяқтары', 'Треккинговые палки', 'Trekking poles'),
];
const FOOD = [
  item('tea', 'Термос шаймен', 'Термос с чаем', 'Thermos with hot tea'),
  item('snacks', 'Жеңіл тағам, шоколад', 'Перекусы, шоколад', 'Snacks, chocolate'),
];
const SAFETY = [
  item('aid', 'Алғашқы көмек қобдишасы', 'Аптечка', 'First-aid kit'),
  item('powerbank', 'Телефон және пауэрбанк', 'Телефон и пауэрбанк', 'Phone and power bank'),
  item('tell', 'Маршрутты жақындарға хабарлау', 'Сообщить близким маршрут', 'Tell someone your route'),
  item('rescue', 'Құтқарушылар: 112', 'Спасатели: 112', 'Rescue service: 112'),
];

const SUMMER_EXTRA = [item('sunscreen', 'Күннен қорғайтын крем', 'Солнцезащитный крем', 'Sunscreen')];
const WINTER_EXTRA = [
  item('crampons', 'Мұз кошкалары', 'Ледовые кошки', 'Ice crampons'),
  item('thermal', 'Жылы іш киім', 'Термобельё', 'Thermal underwear'),
  item('goggles', 'Қорғаныс көзілдірігі', 'Защитные очки', 'Goggles'),
];

/** Checklist by hike type. Item ids are unique across profiles, so ticks are saved per item. */
export function checklistFor(profile: ChecklistProfile): ChecklistGroup[] {
  const extra = profile === 'summer' ? SUMMER_EXTRA : profile === 'winter' ? WINTER_EXTRA : [];
  const gear = profile === 'winter' ? GEAR.filter((g) => g.id !== 'poles') : GEAR;
  const prefix = (items: { id: string; label: Localized }[]) => items.map((i) => ({ ...i, id: `${profile}:${i.id}` }));
  return [
    { id: 'clothing', titleKey: 'checklist.clothing', items: prefix([...CLOTHING, ...(profile === 'winter' ? extra.slice(1, 2) : [])]) },
    { id: 'gear', titleKey: 'checklist.gear', items: prefix([...gear, ...(profile === 'winter' ? [extra[0], extra[2]] : [])]) },
    { id: 'food', titleKey: 'checklist.food', items: prefix(FOOD) },
    { id: 'safety', titleKey: 'checklist.safety', items: prefix([...SAFETY, ...(profile === 'summer' ? extra : [])]) },
  ];
}

/** Which checklist suits a tour. */
export function profileForSeasons(seasons: string[]): ChecklistProfile {
  if (seasons.includes('winter') && seasons.length === 1) return 'winter';
  if (seasons.includes('autumn') && !seasons.includes('summer')) return 'autumn';
  return 'summer';
}
