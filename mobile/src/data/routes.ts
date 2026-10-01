import type { Localized } from '../i18n/types';
import type { Level, Route } from './types';

const GEAR: Record<Level, Localized[]> = {
  easy: [
    { kk: 'Су (1 л)', ru: 'Вода (1 л)', en: 'Water (1 L)' },
    { kk: 'Треккинг аяқ киімі', ru: 'Треккинговая обувь', en: 'Hiking shoes' },
    { kk: 'Жеңіл куртка', ru: 'Лёгкая куртка', en: 'Light jacket' },
    { kk: 'Күннен қорғайтын крем мен көзілдірік', ru: 'Солнцезащитный крем и очки', en: 'Sunscreen and sunglasses' },
    { kk: 'Жеңіл тамақ', ru: 'Перекус', en: 'Snacks' },
  ],
  medium: [
    { kk: 'Су (2 л)', ru: 'Вода (2 л)', en: 'Water (2 L)' },
    { kk: 'Треккинг аяқ киімі', ru: 'Треккинговая обувь', en: 'Hiking boots' },
    { kk: 'Жылы киім мен жел өтпейтін куртка', ru: 'Тёплая одежда и ветровка', en: 'Warm layers and a windproof jacket' },
    { kk: 'Треккинг таяқтары', ru: 'Треккинговые палки', en: 'Trekking poles' },
    { kk: 'Бас киім, көзілдірік, крем', ru: 'Головной убор, очки, крем', en: 'Hat, sunglasses, sunscreen' },
    { kk: 'Дәрі қобдишасы', ru: 'Аптечка', en: 'First aid kit' },
    { kk: 'Тамақ пен термос', ru: 'Еда и термос', en: 'Food and a thermos' },
  ],
  hard: [
    {
      kk: 'Альпинистік жабдық (кошка, мұз балта, арқан)',
      ru: 'Альпинистское снаряжение (кошки, ледоруб, верёвка)',
      en: 'Climbing gear (crampons, ice axe, rope)',
    },
    { kk: 'Шатыр мен ұйықтайтын қап', ru: 'Палатка и спальник', en: 'Tent and sleeping bag' },
    { kk: 'Жылы киім (бірнеше қабат)', ru: 'Тёплая одежда (несколько слоёв)', en: 'Warm clothing (several layers)' },
    { kk: 'Су мен тамақ (2–4 күнге)', ru: 'Вода и еда (на 2–4 дня)', en: 'Water and food (for 2–4 days)' },
    { kk: 'Дәрі қобдишасы', ru: 'Аптечка', en: 'First aid kit' },
    { kk: 'Гид немесе тәжірибелі топ', ru: 'Гид или опытная группа', en: 'A guide or an experienced group' },
  ],
};

// Demo data until the backend has /routes.
// TODO(BA): replace distances, gain and stages with the route table.
export const ROUTES: Route[] = [
  {
    id: 'bao',
    name: { kk: 'Үлкен Алматы көлі', ru: 'Большое Алматинское озеро', en: 'Big Almaty Lake' },
    start: { kk: 'Үлкен Алматы шатқалы', ru: 'Ущелье Большая Алматинка', en: 'Bolshaya Almatinka Gorge' },
    level: 'easy',
    distanceKm: 8,
    gainM: 600,
    duration: { from: 4, to: 5, unit: 'h' },
    season: { from: 5, to: 10 },
    summary: {
      kk: 'Көгілдір көлге апаратын танымал жол. Отбасымен және алғашқы походқа жарайды.',
      ru: 'Популярная тропа к бирюзовому озеру. Подходит для семьи и первого похода.',
      en: 'A popular trail to a turquoise lake. Good for families and a first hike.',
    },
    stages: [
      { name: { kk: 'Шатқалдағы бастау', ru: 'Старт в ущелье', en: 'Gorge trailhead' }, altitudeM: 1900, time: '0:00' },
      { name: { kk: 'Орман жолы', ru: 'Лесная тропа', en: 'Forest trail' }, altitudeM: 2200, time: '1:30' },
      {
        name: { kk: 'Үлкен Алматы көлі', ru: 'Большое Алматинское озеро', en: 'Big Almaty Lake' },
        altitudeM: 2510,
        time: '2:30',
      },
    ],
    gear: GEAR.easy,
  },
  {
    id: 'butakovka',
    name: { kk: 'Бутаковка сарқырамасы', ru: 'Бутаковский водопад', en: 'Butakovka Waterfall' },
    start: { kk: 'Бутаковка ауылы', ru: 'Село Бутаковка', en: 'Butakovka village' },
    level: 'easy',
    distanceKm: 6,
    gainM: 400,
    duration: { from: 3, to: 4, unit: 'h' },
    season: 'all',
    summary: {
      kk: 'Өзен бойымен сарқырамаға дейінгі жеңіл серуен. Жазда да, қыста да барады.',
      ru: 'Лёгкая прогулка вдоль реки до водопада. Ходят и летом, и зимой.',
      en: 'An easy walk along the river to a waterfall, popular in both summer and winter.',
    },
    stages: [
      { name: { kk: 'Ауылдағы бастау', ru: 'Старт в селе', en: 'Village trailhead' }, altitudeM: 1400, time: '0:00' },
      { name: { kk: 'Өзен бойындағы жол', ru: 'Тропа вдоль реки', en: 'Riverside trail' }, altitudeM: 1600, time: '0:50' },
      { name: { kk: 'Сарқырама', ru: 'Водопад', en: 'Waterfall' }, altitudeM: 1800, time: '1:30' },
    ],
    gear: GEAR.easy,
  },
  {
    id: 'kokzhailau',
    name: { kk: 'Көк-Жайлау үстірті', ru: 'Плато Кок-Жайляу', en: 'Kok-Zhailau Plateau' },
    start: { kk: 'Проходной шатқалы', ru: 'Проходное ущелье', en: 'Prokhodnoye Gorge' },
    level: 'medium',
    distanceKm: 9,
    gainM: 700,
    duration: { from: 5, to: 6, unit: 'h' },
    season: { from: 5, to: 10 },
    summary: {
      kk: 'Алматылықтардың сүйікті жайлауы: шырша орманы, кең шалғын және қалаға көрініс.',
      ru: 'Любимое плато алматинцев: еловый лес, широкие луга и вид на город.',
      en: "Almaty's favorite plateau: spruce forest, wide meadows and city views.",
    },
    stages: [
      { name: { kk: 'Проходной шатқалы', ru: 'Проходное ущелье', en: 'Prokhodnoye Gorge' }, altitudeM: 1300, time: '0:00' },
      { name: { kk: 'Тік көтерілу', ru: 'Крутой подъём', en: 'Steep climb' }, altitudeM: 1700, time: '1:20' },
      { name: { kk: 'Көк-Жайлау', ru: 'Кок-Жайляу', en: 'Kok-Zhailau' }, altitudeM: 2000, time: '2:30' },
    ],
    gear: GEAR.medium,
  },
  {
    id: 'bukreev-route',
    name: { kk: 'Букреев шыңына шығу', ru: 'Восхождение на пик Букреева', en: 'Bukreev Peak ascent' },
    mountainId: 'bukreev',
    start: { kk: 'Шымбұлақ', ru: 'Шымбулак', en: 'Shymbulak' },
    level: 'medium',
    distanceKm: 7,
    gainM: 800,
    duration: { from: 6, to: 8, unit: 'h' },
    season: { from: 6, to: 9 },
    summary: {
      kk: 'Шымбұлақтан шығатын қысқа, бірақ тік жол. Үш мыңдыққа алғашқы қадам.',
      ru: 'Короткий, но крутой подъём от Шымбулака. Первый шаг к трёхтысячникам.',
      en: 'A short but steep climb from Shymbulak. A first step towards 3,000 m peaks.',
    },
    stages: [
      { name: { kk: 'Шымбұлақ', ru: 'Шымбулак', en: 'Shymbulak' }, altitudeM: 2200, time: '0:00' },
      {
        name: { kk: 'Талғар асуы жағы', ru: 'Район Талгарского перевала', en: 'Talgar Pass area' },
        altitudeM: 2600,
        time: '1:30',
      },
      { name: { kk: 'Жотамен көтерілу', ru: 'Подъём по гребню', en: 'Ridge climb' }, altitudeM: 2850, time: '2:45' },
      { name: { kk: 'Букреев шыңы', ru: 'Пик Букреева', en: 'Bukreev Peak' }, altitudeM: 3010, time: '3:30' },
    ],
    gear: GEAR.medium,
  },
  {
    id: 'furmanov-route',
    name: { kk: 'Фурманов шыңына шығу', ru: 'Восхождение на пик Фурманова', en: 'Furmanov Peak ascent' },
    mountainId: 'furmanov',
    start: { kk: 'Медеу', ru: 'Медеу', en: 'Medeu' },
    level: 'medium',
    distanceKm: 10,
    gainM: 1300,
    duration: { from: 8, to: 10, unit: 'h' },
    season: { from: 6, to: 9 },
    summary: {
      kk: 'Ұзақ күндік көтерілу. Таңертең ерте шығып, суды көп алу керек.',
      ru: 'Длинный однодневный подъём. Выходите рано утром и берите много воды.',
      en: 'A long one-day climb. Start early and bring plenty of water.',
    },
    stages: [
      { name: { kk: 'Медеу', ru: 'Медеу', en: 'Medeu' }, altitudeM: 1700, time: '0:00' },
      { name: { kk: 'Орман шекарасы', ru: 'Граница леса', en: 'Tree line' }, altitudeM: 2300, time: '2:00' },
      { name: { kk: 'Жота', ru: 'Гребень', en: 'Ridge' }, altitudeM: 2750, time: '3:30' },
      { name: { kk: 'Фурманов шыңы', ru: 'Пик Фурманова', en: 'Furmanov Peak' }, altitudeM: 3053, time: '4:30' },
    ],
    gear: GEAR.medium,
  },
];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

export function routesForMountain(mountainId: string): Route[] {
  return ROUTES.filter((r) => r.mountainId === mountainId);
}
