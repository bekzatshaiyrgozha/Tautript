import { ApiError } from '../api/client';
import type { StringKey } from '../i18n';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAG_RE = /^[A-Za-z0-9_.]{3,30}$/;

export const isValidEmail = (email: string) => EMAIL_RE.test(email.trim());
export const isValidTag = (tag: string) => TAG_RE.test(tag.trim());

const MESSAGES: Record<string, StringKey> = {
  email_taken: 'auth.errEmailTaken',
  tag_taken: 'auth.errTagTaken',
  invalid_credentials: 'auth.errInvalidCredentials',
  invalid_code: 'auth.errInvalidCode',
  code_expired: 'auth.errCodeExpired',
  too_many_attempts: 'auth.errTooManyAttempts',
  too_soon: 'auth.errTooSoon',
  invalid_signup_token: 'auth.errSignupExpired',
  network: 'auth.errNetwork',
};

/** Backend error code of a failed request ("email_taken", "network", ...). */
export const errorCode = (error: unknown) => (error instanceof ApiError ? error.code : 'unknown');

/** Turns a failed auth request into a translated message key. */
export const authErrorKey = (error: unknown): StringKey => MESSAGES[errorCode(error)] ?? 'auth.errUnknown';

/** 0 = empty, 1 = weak, 2 = medium, 3 = strong */
export function passwordStrength(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score <= 2 ? 1 : score === 3 ? 2 : 3;
}

/** "17052004" → "17.05.2004" while typing */
export function formatBirthdayInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('.');
}

/** "17.05.2004" → "2004-05-17", or null if it is not a real past date. */
export function parseBirthday(text: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const real = date.getFullYear() === Number(yyyy) && date.getMonth() === Number(mm) - 1 && date.getDate() === Number(dd);
  if (!real || Number(yyyy) < 1900 || date > new Date()) return null;
  return `${yyyy}-${mm}-${dd}`;
}
