import type { Localized } from '../i18n/types';

export type Level = 'easy' | 'medium' | 'hard';

/** 6–8 hours → { from: 6, to: 8, unit: 'h' }; 2 days → { from: 2, unit: 'd' } */
export type Duration = { from: number; to?: number; unit: 'h' | 'd' };

/** Months 1–12, or all year */
export type Season = { from: number; to: number } | 'all';

export type Mountain = {
  id: string;
  name: Localized;
  heightM: number;
  level: Level;
  duration: Duration;
  area: Localized;
  description: Localized;
};

export type RouteStage = {
  name: Localized;
  altitudeM: number;
  time: string;
};

export type Route = {
  id: string;
  name: Localized;
  mountainId?: string;
  start: Localized;
  level: Level;
  distanceKm: number;
  gainM: number;
  duration: Duration;
  season: Season;
  summary: Localized;
  stages: RouteStage[];
  gear: Localized[];
};
