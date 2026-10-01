import type { StringKey } from '../i18n';
import type { Level } from './types';

export const LEVELS: Record<Level, { labelKey: StringKey; color: string; background: string }> = {
  easy: { labelKey: 'level.easy', color: '#1F7A4D', background: '#E2F3E9' },
  medium: { labelKey: 'level.medium', color: '#9A6200', background: '#FFF1D6' },
  hard: { labelKey: 'level.hard', color: '#B3261E', background: '#FBE3E1' },
};

export const LEVEL_ORDER: Level[] = ['easy', 'medium', 'hard'];
