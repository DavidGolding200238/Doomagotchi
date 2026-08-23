import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function ProfileModal({ visible, onClose, onLogout }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [petName, setPetName] = useState<string | null>(null);
  const [petType, setPetType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible || !user) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (cancelled) return;

        const data = snap.exists() ? snap.data() : {};
        setDisplayName(data.displayName || user.email?.split('@')[0] || 'Player');
        setPetName(data.pet?.name ?? null);
        setPetType(data.pet?.type ?? null);
      } catch (e) {
        console.log('Profile load error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visible, user]);

  const saveName = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { displayName: displayName.trim() },
        { merge: true }
      );
      setEditingName(false);
    } catch (e) {
      console.log('Save name error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>PROFILE</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#1a1a1a" />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#B83F3F" />
            </View>
          ) : (
            <>
              {/* Name */}
              <View style={styles.section}>
                <Text style={styles.label}>DISPLAY NAME</Text>
                {editingName ? (
                  <View style={styles.nameEditRow}>
                    <TextInput
                      style={styles.nameInput}
                      value={displayName}
                      onChangeText={setDisplayName}
                      autoFocus
                      maxLength={24}
                      placeholderTextColor="#999"
                    />
                    <Pressable onPress={saveName} style={styles.saveBtn} disabled={saving}>
                      <Text style={styles.saveBtnText}>{saving ? '…' : 'Save'}</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable style={styles.nameRow} onPress={() => setEditingName(true)}>
                    <Text style={styles.nameValue}>{displayName}</Text>
                    <Ionicons name="pencil" size={16} color="#999" />
                  </Pressable>
                )}
              </View>

              {/* Email */}
              <View style={styles.section}>
                <Text style={styles.label}>EMAIL</Text>
                <Text style={styles.value}>{user?.email ?? '—'}</Text>
              </View>

              {/* Current pet */}
              <View style={styles.section}>
                <Text style={styles.label}>CURRENT PET</Text>
                {petName ? (
                  <Text style={styles.value}>
                    {petName}
                    {petType ? `  ·  ${petType}` : ''}
                  </Text>
                ) : (
                  <Text style={styles.valueMuted}>No pet yet</Text>
                )}
              </View>

              {/* Logout */}
              <Pressable style={styles.logoutBtn} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={18} color="#B83F3F" />
                <Text style={styles.logoutText}>Log out</Text>
              </Pressable>
            </>
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
    marginBottom: 22,
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
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  valueMuted: {
    fontSize: 15,
    color: '#999',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  saveBtn: {
    backgroundColor: '#B83F3F',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  logoutBtn: {
    marginTop: 8,
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
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B83F3F',
  },
});