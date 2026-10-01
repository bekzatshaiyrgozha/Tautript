import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import * as authApi from '../api/auth';
import type { AuthResponse, RegisterPayload, User } from '../api/auth';
import { ApiError } from '../api/client';
import { tokenStorage } from './tokenStorage';

const USER_KEY = 'tautrip:user';

type AuthState =
  | { status: 'loading'; token: null; user: null }
  | { status: 'signedOut'; token: null; user: null }
  | { status: 'signedIn'; token: string; user: User };

type Auth = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  completeSignup: (payload: RegisterPayload) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SIGNED_OUT: AuthState = { status: 'signedOut', token: null, user: null };
const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', token: null, user: null });

  const saveSession = useCallback(async (token: string, user: User) => {
    await tokenStorage.set(token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ status: 'signedIn', token, user });
  }, []);

  const signOut = useCallback(async () => {
    await tokenStorage.clear().catch(() => {});
    await AsyncStorage.removeItem(USER_KEY).catch(() => {});
    setState(SIGNED_OUT);
  }, []);

  // On app start: restore the saved session, then check the token with the server
  useEffect(() => {
    (async () => {
      const token = await tokenStorage.get().catch(() => null);
      const cachedUser = await AsyncStorage.getItem(USER_KEY).catch(() => null);
      if (!token) {
        setState(SIGNED_OUT);
        return;
      }
      if (cachedUser) {
        setState({ status: 'signedIn', token, user: JSON.parse(cachedUser) as User });
      }
      try {
        const user = await authApi.getMe(token);
        await saveSession(token, user);
      } catch (error) {
        // Expired/invalid token → log out. Offline → keep the cached session.
        if ((error instanceof ApiError && error.status === 401) || !cachedUser) await signOut();
      }
    })();
  }, [saveSession, signOut]);

  const startSession = useCallback(
    (response: AuthResponse) => saveSession(response.access_token, response.user),
    [saveSession],
  );

  const value = useMemo<Auth>(
    () => ({
      ...state,
      signIn: async (email, password) => startSession(await authApi.login(email, password)),
      completeSignup: async (payload) => startSession(await authApi.register(payload)),
      resetPassword: async (email, code, newPassword) =>
        startSession(await authApi.passwordReset(email, code, newPassword)),
      signOut,
    }),
    [state, startSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>');
  return auth;
}
