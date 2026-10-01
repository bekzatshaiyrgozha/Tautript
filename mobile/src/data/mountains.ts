import type { Mountain } from './types';

// Demo data until the backend has /mountains.
// TODO(BA): check heights and times against the route table.
export const MOUNTAINS: Mountain[] = [
  {
    id: 'bukreev',
    name: { kk: 'Букреев шыңы', ru: 'Пик Букреева', en: 'Bukreev Peak' },
    heightM: 3010,
    level: 'medium',
    duration: { from: 6, to: 8, unit: 'h' },
    area: { kk: 'Кіші Алматы шатқалы', ru: 'Ущелье Малая Алматинка', en: 'Malaya Almatinka Gorge' },
    description: {
      kk: 'Бұрынғы Пионер шыңы, 2007 жылдан бері альпинист Анатолий Букреевтің атымен аталады. Шыңнан Алматы, Талғар және Фурманов шыңдары көрінеді. Алғашқы үш мыңдыққа жақсы таңдау.',
      ru: 'Бывший пик Пионер, с 2007 года носит имя альпиниста Анатолия Букреева. С вершины видны Алматы, пики Талгар и Фурманова. Хороший выбор для первого трёхтысячника.',
      en: 'Formerly Pioneer Peak, named after mountaineer Anatoli Boukreev since 2007. The summit overlooks Almaty, Talgar and Furmanov peaks. A good first 3,000 m peak.',
    },
  },
  {
    id: 'furmanov',
    name: { kk: 'Фурманов шыңы', ru: 'Пик Фурманова', en: 'Furmanov Peak' },
    heightM: 3053,
    level: 'medium',
    duration: { from: 8, to: 10, unit: 'h' },
    area: { kk: 'Медеу', ru: 'Медеу', en: 'Medeu' },
    description: {
      kk: 'Алматыға ең жақын шыңдардың бірі. Жолы ұзақ, бірақ техникалық емес — жақсы дайындық пен ерте шығу жеткілікті.',
      ru: 'Одна из ближайших к Алматы вершин. Путь долгий, но не технический — достаточно хорошей подготовки и раннего выхода.',
      en: 'One of the closest peaks to Almaty. A long but non-technical climb — good fitness and an early start are enough.',
    },
  },
  {
    id: 'kumbel',
    name: { kk: 'Кумбель шыңы', ru: 'Пик Кумбель', en: 'Kumbel Peak' },
    heightM: 3200,
    level: 'medium',
    duration: { from: 7, to: 9, unit: 'h' },
    area: { kk: 'Шымбұлақ', ru: 'Шымбулак', en: 'Shymbulak' },
    description: {
      kk: 'Шымбұлақ үстіндегі шың. Жолы тік, бірақ тәжірибелі жаяу жүргіншілерге қолжетімді. Жоғарыдан Медеу мен Туйықсу мұздықтары көрінеді.',
      ru: 'Вершина над Шымбулаком. Подъём крутой, но доступный опытным туристам. Сверху видны Медеу и ледники Туюксу.',
      en: 'The peak above Shymbulak. A steep climb, but doable for experienced hikers. Views of Medeu and the Tuyuksu glaciers.',
    },
  },
  {
    id: 'bap',
    name: { kk: 'Үлкен Алматы шыңы', ru: 'Большой Алматинский пик', en: 'Big Almaty Peak' },
    heightM: 3681,
    level: 'hard',
    duration: { from: 2, unit: 'd' },
    area: { kk: 'Үлкен Алматы шатқалы', ru: 'Ущелье Большая Алматинка', en: 'Bolshaya Almatinka Gorge' },
    description: {
      kk: 'Алматының символы — қаладан көрінетін пирамида тәрізді шың. Тәжірибе, жылы жабдық және түнеу керек.',
      ru: 'Символ Алматы — пирамида, которую видно из города. Нужны опыт, тёплое снаряжение и ночёвка.',
      en: 'The symbol of Almaty — a pyramid visible from the city. Requires experience, warm gear and an overnight stay.',
    },
  },
  {
    id: 'talgar',
    name: { kk: 'Талғар шыңы', ru: 'Пик Талгар', en: 'Talgar Peak' },
    heightM: 4979,
    level: 'hard',
    duration: { from: 3, to: 4, unit: 'd' },
    area: { kk: 'Талғар', ru: 'Талгар', en: 'Talgar' },
    description: {
      kk: 'Іле Алатауының ең биік нүктесі. Тек альпинистерге арналған: мұздық, арқан және гид міндетті.',
      ru: 'Высшая точка Заилийского Алатау. Только для альпинистов: ледник, верёвка и гид обязательны.',
      en: 'The highest point of the Trans-Ili Alatau. Mountaineers only: glacier travel, rope and a guide are required.',
    },
  },
];

export function getMountain(id: string): Mountain | undefined {
  return MOUNTAINS.find((m) => m.id === id);
}
