import { apiRequest } from './client';

export type Preference = 'peaks' | 'lakes' | 'waterfalls' | 'camping' | 'climbing' | 'easy_walks' | 'winter' | 'glaciers';

export const PREFERENCES: Preference[] = [
  'peaks',
  'lakes',
  'waterfalls',
  'camping',
  'climbing',
  'easy_walks',
  'winter',
  'glaciers',
];

export type User = {
  id: number;
  name: string;
  email: string;
  tag: string;
  birthday: string | null; // YYYY-MM-DD
  gender: 'male' | 'female' | null;
  preferences: Preference[];
};

export type AuthResponse = {
  access_token: string;
  token_type: 'bearer';
  user: User;
};

/** `dev_code` is set only when the server has no email configured (development). */
export type CodeSent = {
  email: string;
  expires_in_minutes: number;
  dev_code: string | null;
};

export type RegisterPayload = {
  signup_token: string;
  tag: string;
  password: string;
  name: string;
  birthday: string | null;
  gender: 'male' | 'female' | null;
  preferences: Preference[];
};

const post = <T>(path: string, body: unknown) => apiRequest<T>(path, { method: 'POST', body });

// Sign-up: 1) email + tag → code sent, 2) code → signup_token, 3) profile → account
export const signupStart = (email: string, tag: string) => post<CodeSent>('/auth/signup/start', { email, tag });
export const signupVerify = (email: string, code: string) =>
  post<{ signup_token: string }>('/auth/signup/verify', { email, code });
export const register = (payload: RegisterPayload) => post<AuthResponse>('/auth/register', payload);

export const login = (email: string, password: string) => post<AuthResponse>('/auth/login', { email, password });
export const getMe = (token: string) => apiRequest<User>('/auth/me', { token });

export const passwordForgot = (email: string) => post<CodeSent>('/auth/password/forgot', { email });
export const passwordReset = (email: string, code: string, newPassword: string) =>
  post<AuthResponse>('/auth/password/reset', { email, code, new_password: newPassword });
