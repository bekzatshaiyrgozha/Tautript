import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = 'tautrip.token';

// iPhone: Keychain (SecureStore). Web preview has no Keychain → AsyncStorage.
export const tokenStorage = {
  get: () => (Platform.OS === 'web' ? AsyncStorage.getItem(KEY) : SecureStore.getItemAsync(KEY)),
  set: (token: string) =>
    Platform.OS === 'web' ? AsyncStorage.setItem(KEY, token) : SecureStore.setItemAsync(KEY, token),
  clear: () => (Platform.OS === 'web' ? AsyncStorage.removeItem(KEY) : SecureStore.deleteItemAsync(KEY)),
};
