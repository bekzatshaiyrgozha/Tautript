import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { isOnboarded } from '../../state/onboarding';
import { colors } from '../../theme';

export const unstable_settings = { initialRouteName: 'login' };

export default function AuthLayout() {
  // First launch: show the onboarding once, then always go to sign-in
  const [showOnboarding, setShowOnboarding] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    isOnboarded().then((done) => setShowOnboarding(!done));
  }, []);

  useEffect(() => {
    if (showOnboarding) router.replace('/onboarding');
  }, [showOnboarding]);

  if (showOnboarding === undefined) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.card } }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot" />
    </Stack>
  );
}
