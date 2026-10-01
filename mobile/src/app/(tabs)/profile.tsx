import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../components/Avatar';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useI18n } from '../../i18n';
import { useAuth } from '../../state/auth';
import { useStore } from '../../state/store';
import { colors, radius } from '../../theme';

export default function ProfileScreen() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const { profile, favorites, setAvatar } = useStore();

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('profile.photoPermTitle'), t('profile.photoPermText'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('profile.title')}</Text>

        <View style={styles.avatarBlock}>
          <Pressable onPress={pickPhoto} accessibilityLabel={t('profile.photoChange')}>
            <Avatar uri={profile.avatarUri} name={user?.name ?? ''} size={104} />
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.photoActions}>
            <Pressable onPress={pickPhoto} hitSlop={6}>
              <Text style={styles.link}>{t(profile.avatarUri ? 'profile.photoChange' : 'profile.photoSet')}</Text>
            </Pressable>
            {profile.avatarUri && (
              <Pressable onPress={() => setAvatar(null)} hitSlop={6}>
                <Text style={styles.linkMuted}>{t('profile.photoRemove')}</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.stats}>
          <StatBox value={favorites.mountains.length} label={t('profile.favMountains')} />
          <StatBox value={favorites.routes.length} label={t('profile.favRoutes')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t('profile.language')}</Text>
          <LanguageSwitcher />
        </View>

        <Pressable
          onPress={signOut}
          style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  avatarBlock: { alignItems: 'center', gap: 4 },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  name: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 8 },
  email: { fontSize: 14, color: colors.muted },
  photoActions: { flexDirection: 'row', gap: 16, marginTop: 6 },
  link: { fontSize: 15, fontWeight: '600', color: colors.primary },
  linkMuted: { fontSize: 15, color: colors.muted },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted, textTransform: 'uppercase' },
  stats: { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 13, color: colors.muted, marginTop: 2, textAlign: 'center' },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: '#FDECEA',
  },
  pressed: { opacity: 0.7 },
  logoutText: { fontSize: 16, fontWeight: '600', color: colors.error },
});
