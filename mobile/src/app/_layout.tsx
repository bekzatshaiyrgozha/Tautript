import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { MountainThumb } from '../components/MountainThumb';
import { PhoneFrame } from '../components/PhoneFrame';
import { I18nProvider, useI18n } from '../i18n';
import { AuthProvider, useAuth } from '../state/auth';
import { StoreProvider } from '../state/store';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <StoreProvider>
          <PhoneFrame>
            <RootNavigator />
          </PhoneFrame>
          <StatusBar style="dark" />
        </StoreProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

function RootNavigator() {
  const { status } = useAuth();
  const { t } = useI18n();

  if (status === 'loading') {
    return (
      <View style={styles.splash}>
        <MountainThumb size={84} />
        <Text style={styles.splashText}>TauTrip</Text>
        <ActivityIndicator color={colors.primary} style={styles.spinner} />
      </View>
    );
  }

  const signedIn = status === 'signedIn';
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        headerBackTitle: t('common.back'),
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {/* Only for logged-in users */}
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="mountain/[id]" />
        <Stack.Screen name="route/[id]" />
        <Stack.Screen name="tour/[id]" />
        <Stack.Screen name="compare" />
        <Stack.Screen name="checklist" />
      </Stack.Protected>

      {/* Only for guests: login / register */}
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background },
  splashText: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, letterSpacing: -0.8 },
  spinner: { marginTop: 8 },
});
