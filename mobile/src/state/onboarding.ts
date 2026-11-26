import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'tautrip:onboarded';

export async function isOnboarded(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === '1';
  } catch {
    return false;
  }
}

export async function markOnboarded(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, '1');
  } catch {
    // not critical: onboarding will just show again
  }
}
