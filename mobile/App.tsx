import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { getHealth } from './src/api/health';
import { API_URL } from './src/config';

type ServerState =
  | { kind: 'loading' }
  | { kind: 'ok'; version: string }
  | { kind: 'error'; message: string };

export default function App() {
  const [server, setServer] = useState<ServerState>({ kind: 'loading' });

  const checkServer = useCallback(async () => {
    setServer({ kind: 'loading' });
    try {
      const health = await getHealth();
      setServer({ kind: 'ok', version: health.version });
    } catch (error) {
      setServer({ kind: 'error', message: error instanceof Error ? error.message : String(error) });
    }
  }, []);

  useEffect(() => {
    checkServer();
  }, [checkServer]);

  return (
    <View style={styles.screen}>
      <Text style={styles.logo}>⛰️</Text>
      <Text style={styles.title}>TauTrip</Text>
      <Text style={styles.subtitle}>Алматы тауларындағы маршруттар</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Сервер</Text>

        {server.kind === 'loading' && (
          <View style={styles.row}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.statusText}>Тексеріп жатырмыз…</Text>
          </View>
        )}

        {server.kind === 'ok' && (
          <>
            <Text style={[styles.statusText, styles.ok]}>Сервер жұмыс істеп тұр ✅</Text>
            <Text style={styles.muted}>Нұсқа: {server.version}</Text>
          </>
        )}

        {server.kind === 'error' && (
          <>
            <Text style={[styles.statusText, styles.error]}>Серверге қосылу мүмкін болмады ❌</Text>
            <Text style={styles.muted}>
              Сервер қосулы ма және iPhone мен компьютер бір Wi-Fi-да ма, тексеріңіз.
            </Text>
            <Text style={styles.muted}>Қате: {server.message}</Text>
          </>
        )}

        <Text style={styles.url}>{API_URL}</Text>

        <Pressable
          onPress={checkServer}
          disabled={server.kind === 'loading'}
          style={({ pressed }) => [
            styles.button,
            (pressed || server.kind === 'loading') && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Қайта тексеру</Text>
        </Pressable>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const colors = {
  background: '#F2F5F3',
  card: '#FFFFFF',
  primary: '#1F6F50',
  text: '#16211C',
  muted: '#5D6B64',
  ok: '#1F6F50',
  error: '#B3261E',
  border: '#DDE5E0',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: { fontSize: 48 },
  title: { fontSize: 34, fontWeight: '700', color: colors.text, marginTop: 8 },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 4, marginBottom: 32, textAlign: 'center' },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 8,
  },
  cardLabel: { fontSize: 13, fontWeight: '600', color: colors.muted, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { fontSize: 18, fontWeight: '600', color: colors.text },
  ok: { color: colors.ok },
  error: { color: colors.error },
  muted: { fontSize: 14, color: colors.muted },
  url: { fontSize: 12, color: colors.muted, fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), marginTop: 4 },
  button: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
