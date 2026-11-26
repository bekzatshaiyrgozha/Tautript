import type { Art } from '../components/LandscapeArt';
import type { Localized } from '../i18n/types';
import scraped from './offers.json';
import type { Level } from './types';

export type SeasonName = 'spring' | 'summer' | 'autumn' | 'winter';

/** One company's tour, collected from its website by backend/scripts/scrape_tours.py. */
export type Offer = {
  id: string;
  company: CompanyId;
  title: string;
  description?: string;
  url: string;
  destinations: string[];
  /** Per person. `null` = the site does not publish a price */
  priceKzt: number | null;
  /** 'perPerson', or 'group:N' — cheapest per-person price for a group of N */
  priceNote: string | null;
  days: number;
  durationLabel: string | null;
  /** ISO dates of departures published on the site */
  dates: string[];
  meetingPoint: string | null;
  /** ISO date when the scraper read the page */
  checkedAt: string;
};

export type CompanyId = 'azimut' | 'algri' | 'monte';

export const COMPANIES: Record<CompanyId, { name: string; site: string; color: string }> = {
  azimut: { name: 'Azimut Travel', site: 'azimut-travel.kz', color: '#2E6FA8' },
  algri: { name: 'Algri Travel', site: 'algritravel.kz', color: '#C0562B' },
  monte: { name: 'Monte', site: 'mnt.kz', color: '#1F4D40' },
};

/**
 * A place you can go (Kolsai, Big Almaty Lake…), like a product on Kaspi:
 * several companies sell a tour there, each with its own price and dates.
 */
export type Tour = {
  id: string;
  name: Localized;
  area: Localized;
  description: Localized;
  art: Art;
  level: Level;
  seasons: SeasonName[];
  offers: Offer[];
  /** Cheapest published price per person */
  priceKzt: number | null;
  companies: number;
  minDays: number;
  maxDays: number;
  /** Earliest upcoming departure among all offers */
  nextDate: string | null;
};

type Place = Omit<Tour, 'offers' | 'priceKzt' | 'companies' | 'minDays' | 'maxDays' | 'nextDate'>;

const PLACES: Place[] = [
  {
    id: 'kolsai',
    art: 'lakes',
    level: 'medium',
    seasons: ['spring', 'summer', 'autumn'],
    name: { kk: 'Қолсай көлдері мен Қайыңды', ru: 'Озёра Кольсай и Каинды', en: 'Kolsai Lakes and Kaindy' },
    area: { kk: 'Қолсай көлдері ұлттық паркі', ru: 'Нацпарк «Кольсайские озёра»', en: 'Kolsai Lakes National Park' },
    description: {
      kk: 'Шыршалы беткейлер арасындағы үш таулы көл және суда тұрған қайыңдары бар Қайыңды көлі. Бір күндік те, түнейтін де турлар бар.',
      ru: 'Три горных озера среди еловых склонов и озеро Каинды с затопленным лесом. Есть туры на один день и с ночёвкой.',
      en: 'Three mountain lakes among spruce slopes and Lake Kaindy with its sunken forest. One-day and overnight tours.',
    },
  },
  {
    id: 'charyn',
    art: 'gorge',
    level: 'easy',
    seasons: ['spring', 'summer', 'autumn'],
    name: { kk: 'Шарын шатқалы', ru: 'Чарынский каньон', en: 'Charyn Canyon' },
    area: { kk: 'Шарын ұлттық паркі', ru: 'Нацпарк «Чарын»', en: 'Charyn National Park' },
    description: {
      kk: 'Қамалдар аңғары мен Шарын өзені: қызыл жартастар арасымен жеңіл серуен. Көбіне Қолсаймен бірге барады.',
      ru: 'Долина замков и река Чарын: лёгкая прогулка среди красных скал. Часто едут вместе с Кольсаем.',
      en: 'The Valley of Castles and the Charyn river: an easy walk among red cliffs. Often combined with Kolsai.',
    },
  },
  {
    id: 'bao',
    art: 'lake',
    level: 'medium',
    seasons: ['summer', 'autumn'],
    name: { kk: 'Үлкен Алматы көлі', ru: 'Большое Алматинское озеро', en: 'Big Almaty Lake' },
    area: { kk: 'Үлкен Алматы шатқалы', ru: 'Ущелье Большая Алматинка', en: 'Bolshaya Almatinka Gorge' },
    description: {
      kk: 'Алматы маңындағы бозғылт-жасыл көл. Бекеттен көлге дейін 6–7 км жаяу көтерілу.',
      ru: 'Бирюзовое озеро рядом с Алматы. От поста к озеру — 6–7 км пешего подъёма.',
      en: 'A turquoise lake near Almaty. A 6–7 km hike up from the checkpoint to the lake.',
    },
  },
  {
    id: 'turgen',
    art: 'waterfall',
    level: 'easy',
    seasons: ['spring', 'summer', 'autumn'],
    name: { kk: 'Түрген және Есік', ru: 'Тургень и Иссык', en: 'Turgen and Issyk' },
    area: { kk: 'Түрген шатқалы, Ассы үстірті', ru: 'Тургенское ущелье, плато Ассы', en: 'Turgen Gorge, Assy Plateau' },
    description: {
      kk: 'Аю сарқырамасы, Ассы үстірті және Есік көлі — Алматыдан бір күндік сапар.',
      ru: 'Медвежий водопад, плато Ассы и озеро Иссык — поездка на один день из Алматы.',
      en: 'Bear Waterfall, the Assy Plateau and Lake Issyk — a day trip from Almaty.',
    },
  },
  {
    id: 'kok-zhailau',
    art: 'peak',
    level: 'easy',
    seasons: ['spring', 'summer', 'autumn'],
    name: { kk: 'Көк-Жайлау', ru: 'Кок-Жайляу', en: 'Kok-Zhailau' },
    area: { kk: 'Іле Алатауы', ru: 'Заилийский Алатау', en: 'Trans-Ili Alatau' },
    description: {
      kk: 'Қала шетіндегі ең танымал тау жайлауы: жеңіл көтерілу және кең көрініс.',
      ru: 'Самое популярное горное плато у города: несложный подъём и широкие виды.',
      en: 'The most popular mountain meadow next to the city: an easy climb and wide views.',
    },
  },
  {
    id: 'butakovka',
    art: 'waterfall',
    level: 'easy',
    seasons: ['spring', 'summer', 'autumn'],
    name: { kk: 'Бутаков сарқырамасы', ru: 'Бутаковский водопад', en: 'Butakovka Waterfall' },
    area: { kk: 'Бутаков шатқалы', ru: 'Бутаковское ущелье', en: 'Butakovka Gorge' },
    description: {
      kk: 'Орманды шатқал бойымен сарқырамаға дейін жеңіл серуен.',
      ru: 'Лёгкий поход по лесистому ущелью к водопаду.',
      en: 'An easy walk up a forested gorge to the waterfall.',
    },
  },
  {
    id: 'altyn-emel',
    art: 'gorge',
    level: 'medium',
    seasons: ['spring', 'autumn'],
    name: { kk: 'Алтынемел', ru: 'Алтын-Эмель', en: 'Altyn-Emel' },
    area: { kk: 'Алтынемел ұлттық паркі', ru: 'Нацпарк «Алтын-Эмель»', en: 'Altyn-Emel National Park' },
    description: {
      kk: 'Ақтау және Катутау таулары мен Әнші бархан — көлікпен жүретін ұзақ сапар.',
      ru: 'Горы Актау и Катутау и Поющий бархан — долгая поездка на внедорожнике.',
      en: 'The Aktau and Katutau mountains and the Singing Dune — a long off-road trip.',
    },
  },
];

export const OFFERS = scraped.offers as Offer[];
export const DATA_UPDATED: string = scraped.generatedAt;
/** How many companies the current data comes from */
export const SOURCE_COMPANIES = new Set(OFFERS.map((o) => o.company)).size;

/** Today as YYYY-MM-DD in the phone's time zone. */
export function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function upcomingDates(offer: Offer, today = todayIso()): string[] {
  return offer.dates.filter((date) => date >= today);
}

function build(place: Place): Tour {
  const offers = OFFERS.filter((o) => o.destinations.includes(place.id));
  const prices = offers.map((o) => o.priceKzt).filter((p): p is number => p !== null);
  const upcoming = offers.flatMap((o) => upcomingDates(o)).sort();
  return {
    ...place,
    offers,
    priceKzt: prices.length ? Math.min(...prices) : null,
    companies: new Set(offers.map((o) => o.company)).size,
    minDays: offers.length ? Math.min(...offers.map((o) => o.days)) : 1,
    maxDays: offers.length ? Math.max(...offers.map((o) => o.days)) : 1,
    nextDate: upcoming[0] ?? null,
  };
}

/** Places that have at least one offer, the ones with more offers first. */
export const TOURS: Tour[] = PLACES.map(build)
  .filter((tour) => tour.offers.length > 0)
  .sort((a, b) => b.offers.length - a.offers.length);

export function getTour(id: string | undefined): Tour | undefined {
  return TOURS.find((t) => t.id === id);
}

export const MAX_COMPARE = 3;
