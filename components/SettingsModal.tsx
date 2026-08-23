import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import {
    hasUsagePermission,
    requestUsagePermission
} from '@/services/usage';
import { Ionicons } from '@expo/vector-icons';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

const APP_LABELS: Record<string, string> = {
  'com.instagram.android': 'Instagram',
  'com.zhiliaoapp.musically': 'TikTok',
  'com.ss.android.ugc.trill': 'TikTok (alt)',
  'com.twitter.android': 'X',
  'com.google.android.youtube': 'YouTube',
  'com.facebook.katana': 'Facebook',
  'com.facebook.orca': 'Messenger',
  'com.reddit.frontpage': 'Reddit',
  'com.snapchat.android': 'Snapchat',
};

// Unique labels for the UI (collapse duplicate TikTok packages)
const TRACKABLE_APPS = [
  { id: 'instagram', label: 'Instagram', packages: ['com.instagram.android'] },
  { id: 'tiktok', label: 'TikTok', packages: ['com.zhiliaoapp.musically', 'com.ss.android.ugc.trill'] },
  { id: 'x', label: 'X', packages: ['com.twitter.android'] },
  { id: 'youtube', label: 'YouTube', packages: ['com.google.android.youtube'] },
  { id: 'facebook', label: 'Facebook', packages: ['com.facebook.katana'] },
  { id: 'messenger', label: 'Messenger', packages: ['com.facebook.orca'] },
  { id: 'reddit', label: 'Reddit', packages: ['com.reddit.frontpage'] },
  { id: 'snapchat', label: 'Snapchat', packages: ['com.snapchat.android'] },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SettingsModal({ visible, onClose }: Props) {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!visible || !user) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const granted = await hasUsagePermission();
        if (cancelled) return;
        setPermission(granted);

        const snap = await getDoc(doc(db, 'users', user.uid));
        if (cancelled) return;

        const saved: string[] = snap.exists() ? snap.data()?.trackedAppIds ?? null : null;

        const next: Record<string, boolean> = {};
        TRACKABLE_APPS.forEach((app) => {
          // Default all on if nothing saved yet
          next[app.id] = saved ? saved.includes(app.id) : true;
        });
        setEnabled(next);
      } catch (e) {
        console.log('Settings load error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visible, user]);

  const toggleApp = async (id: string) => {
    if (!user) return;
    const next = { ...enabled, [id]: !enabled[id] };
    setEnabled(next);

    const trackedAppIds = Object.keys(next).filter((k) => next[k]);
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), { trackedAppIds }, { merge: true });
    } catch (e) {
      console.log('Save tracked apps error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handlePermission = async () => {
    await requestUsagePermission();
    const granted = await hasUsagePermission();
    setPermission(granted);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account, pet, and graveyard. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            setDeleting(true);
            try {
              await deleteDoc(doc(db, 'users', user.uid));
              await deleteUser(user);
              await signOut();
              onClose();
            } catch (e: any) {
              console.log('Delete account error:', e);
              Alert.alert(
                'Could not delete',
                e?.message?.includes('requires-recent-login')
                  ? 'For security, log out and log back in, then try again.'
                  : 'Something went wrong. Try again later.'
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>SETTINGS</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#1a1a1a" />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#B83F3F" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Usage permission */}
              <Text style={styles.sectionTitle}>USAGE ACCESS</Text>
              <View style={styles.permissionCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permissionTitle}>
                    {permission ? 'Permission granted' : 'Permission required'}
                  </Text>
                  <Text style={styles.permissionSub}>
                    {permission
                      ? 'Doomagotchi can read social app usage'
                      : 'Needed to track real scroll time'}
                  </Text>
                </View>
                {!permission && (
                  <Pressable style={styles.permissionBtn} onPress={handlePermission}>
                    <Text style={styles.permissionBtnText}>Enable</Text>
                  </Pressable>
                )}
                {permission && (
                  <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
                )}
              </View>

              {/* Tracked apps */}
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>TRACKED APPS</Text>
              <Text style={styles.sectionHint}>
                Only these apps count toward your scroll limit
              </Text>

              <View style={styles.appsList}>
                {TRACKABLE_APPS.map((app) => (
                  <View key={app.id} style={styles.appRow}>
                    <Text style={styles.appLabel}>{app.label}</Text>
                    <Switch
                      value={!!enabled[app.id]}
                      onValueChange={() => toggleApp(app.id)}
                      trackColor={{ false: '#E5E0DB', true: '#F5C6C6' }}
                      thumbColor={enabled[app.id] ? '#B83F3F' : '#f4f3f4'}
                    />
                  </View>
                ))}
              </View>

              {saving && (
                <Text style={styles.savingText}>Saving…</Text>
              )}

              {/* Delete account */}
              <Pressable
                style={styles.deleteBtn}
                onPress={handleDeleteAccount}
                disabled={deleting}
              >
                <Ionicons name="trash-outline" size={17} color="#B83F3F" />
                <Text style={styles.deleteText}>
                  {deleting ? 'Deleting…' : 'Delete account'}
                </Text>
              </Pressable>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFF9F5',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    padding: 22,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 13,
    color: '#1a1a1a',
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
    marginTop: -4,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    padding: 14,
    gap: 12,
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  permissionSub: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },
  permissionBtn: {
    backgroundColor: '#B83F3F',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  appsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    overflow: 'hidden',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f5efe9',
  },
  appLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  savingText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  deleteBtn: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#F5C6C6',
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
    paddingVertical: 14,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B83F3F',
  },
});