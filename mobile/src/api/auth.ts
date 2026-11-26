import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEMO } from '../config';
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

// ---------- Demo mode (EXPO_PUBLIC_DEMO=1): same functions, answers made up on the device ----------

const DEMO_CODE = '123456';
const USER_KEY = 'tautrip:user'; // the session cache written by state/auth.tsx
const pause = () => new Promise((resolve) => setTimeout(resolve, 250));

const demoUser = (email: string, extra: Partial<User> = {}): User => ({
  id: 1,
  name: 'Alex Hiker',
  email,
  tag: email.split('@')[0] || 'alexhiker',
  birthday: null,
  gender: null,
  preferences: [],
  ...extra,
});

const demoSession = (user: User): AuthResponse => ({ access_token: 'demo-token', token_type: 'bearer', user });

const demoCodeSent = (email: string): CodeSent => ({ email, expires_in_minutes: 10, dev_code: DEMO_CODE });

const demo = {
  async signupStart(email: string): Promise<CodeSent> {
    await pause();
    return demoCodeSent(email);
  },
  async signupVerify(email: string): Promise<{ signup_token: string }> {
    await pause();
    return { signup_token: `demo:${email}` };
  },
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await pause();
    const email = payload.signup_token.replace(/^demo:/, '');
    return demoSession(
      demoUser(email, {
        name: payload.name,
        tag: payload.tag,
        birthday: payload.birthday,
        gender: payload.gender,
        preferences: payload.preferences,
      }),
    );
  },
  async login(email: string): Promise<AuthResponse> {
    await pause();
    return demoSession(demoUser(email));
  },
  async getMe(): Promise<User> {
    const cached = await AsyncStorage.getItem(USER_KEY).catch(() => null);
    return cached ? (JSON.parse(cached) as User) : demoUser('demo@tautrip.kz');
  },
  async passwordReset(email: string): Promise<AuthResponse> {
    await pause();
    return demoSession(demoUser(email));
  },
};

// ---------- API ----------

// Sign-up: 1) email + tag → code sent, 2) code → signup_token, 3) profile → account
export const signupStart = (email: string, tag: string) =>
  DEMO ? demo.signupStart(email) : post<CodeSent>('/auth/signup/start', { email, tag });
export const signupVerify = (email: string, code: string) =>
  DEMO ? demo.signupVerify(email) : post<{ signup_token: string }>('/auth/signup/verify', { email, code });
export const register = (payload: RegisterPayload) =>
  DEMO ? demo.register(payload) : post<AuthResponse>('/auth/register', payload);

export const login = (email: string, password: string) =>
  DEMO ? demo.login(email) : post<AuthResponse>('/auth/login', { email, password });
export const getMe = (token: string) => (DEMO ? demo.getMe() : apiRequest<User>('/auth/me', { token }));

export const passwordForgot = (email: string) =>
  DEMO ? pause().then(() => demoCodeSent(email)) : post<CodeSent>('/auth/password/forgot', { email });
export const passwordReset = (email: string, code: string, newPassword: string) =>
  DEMO ? demo.passwordReset(email) : post<AuthResponse>('/auth/password/reset', { email, code, new_password: newPassword });
