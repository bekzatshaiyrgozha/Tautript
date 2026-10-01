import Constants from 'expo-constants';

const API_PORT = 8000;

/**
 * In development the phone loads the app from your computer (Expo dev server,
 * e.g. "192.168.1.5:8081"). The backend runs on the same computer, so we reuse
 * that IP with the API port. Set EXPO_PUBLIC_API_URL in .env to override.
 */
function devComputerHost(): string | undefined {
  return Constants.expoConfig?.hostUri?.split(':')[0];
}

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${devComputerHost() ?? 'localhost'}:${API_PORT}`;
