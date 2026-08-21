import { BadgeIcon } from '@/components/BadgeIcon';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import { applyHealthTick, type PetHealthState } from '@/services/health';
import {
  checkAndRequestUsagePermission,
  getPetScrollMinutes,
  getUTCDateKey,
} from '@/services/usage';
import { styles } from '@/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// ─────────────────────────────────────────────
// ASSETS
// ─────────────────────────────────────────────
const DUCK_IDLE = require('@/assets/pets/Duck/Duck Idle.gif');
const DUCK_WALK = require('@/assets/pets/Duck/Duck Walk.gif');
const DUCK_SICK = require('@/assets/pets/Duck/Duck Sick.gif');
const DUCK_DEAD = require('@/assets/pets/Duck/Duck Dead.gif');

const SPINO_IDLE = require('@/assets/pets/Spinosaurus/Idle Spino.gif');
const SPINO_WALK = require('@/assets/pets/Spinosaurus/Walking Spino.gif');
const SPINO_SICK = require('@/assets/pets/Spinosaurus/Sick Spino.gif');
const SPINO_DEAD = require('@/assets/pets/Spinosaurus/Dead spino.gif');

const PANDA_IDLE= require('@/assets/pets/Panda/Panda Idle.gif');
const PANDA_EATING = require('@/assets/pets/Panda/Panda Eating.gif');
const PANDA_SICK = require('@/assets/pets/Panda/Sick Panda.gif');
const PANDA_DEAD = require('@/assets/pets/Panda/Dead Panda.gif');

const SUN_BADGE = require('@/assets/images/Sun badge.png');
const FIRST_LIGHT_ICON = require('@/assets/images/First Light.png');
const LOCK_ICON = require('@/assets/images/Lock icon.png');

type AnimState = 'happy' | 'sick' | 'dead';

const PET_FRAMES: Record<string, Record<AnimState, any[]>> = {
  Nugget: {
    happy: [PANDA_IDLE, PANDA_EATING],
    sick: [PANDA_SICK],
    dead: [PANDA_DEAD],
  },
  Waddles: {
    happy: [DUCK_IDLE, DUCK_WALK],
    sick: [DUCK_SICK],
    dead: [DUCK_DEAD],
  },
  Spino: {
    happy: [SPINO_IDLE, SPINO_WALK],
    sick: [SPINO_SICK],
    dead: [SPINO_DEAD],
  },
};

function getAnimState(health: number): AnimState {
  if (health <= 0) return 'dead';
  if (health < 50) return 'sick';
  return 'happy';
}

// ─────────────────────────────────────────────
// CHALLENGES
// ─────────────────────────────────────────────
type ChallengeStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'failed';

type Challenge = {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'streak' | 'milestone';
  goal: string;
  current: number;
  target: number;
  status: ChallengeStatus;
  xp: number;
};

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: '1',
    name: 'First Light',
    description: 'Stay under your scroll limit for 1 full day',
    type: 'daily',
    goal: '1 healthy day',
    current: 0,
    target: 1,
    status: 'available',
    xp: 40,
  },
  {
    id: '2',
    name: 'No Reels Night',
    description: 'Zero Instagram / TikTok / Reels between 21:00 – 07:00',
    type: 'daily',
    goal: 'Clean night',
    current: 0,
    target: 1,
    status: 'locked',
    xp: 50,
  },
  {
    id: '3',
    name: 'Two-Day Streak',
    description: 'Keep your pet healthy for 2 consecutive days',
    type: 'streak',
    goal: '2 day streak',
    current: 0,
    target: 2,
    status: 'locked',
    xp: 80,
  },
  {
    id: '4',
    name: 'Scroll Fast',
    description: 'Stay under 50% of your daily limit',
    type: 'daily',
    goal: 'Under 50%',
    current: 0,
    target: 1,
    status: 'locked',
    xp: 60,
  },
  {
    id: '5',
    name: 'Three-Day Streak',
    description: '3 consecutive healthy days',
    type: 'streak',
    goal: '3 day streak',
    current: 0,
    target: 3,
    status: 'locked',
    xp: 120,
  },
  {
    id: '6',
    name: 'Morning Mute',
    description: 'No social apps before 10:00',
    type: 'daily',
    goal: 'Clean morning',
    current: 0,
    target: 1,
    status: 'locked',
    xp: 45,
  },
  {
    id: '7',
    name: 'Five-Day Guardian',
    description: '5 consecutive days under limit',
    type: 'streak',
    goal: '5 day streak',
    current: 0,
    target: 5,
    status: 'locked',
    xp: 180,
  },
  {
    id: '8',
    name: 'Weekend Warrior',
    description: 'Both Saturday and Sunday under limit',
    type: 'streak',
    goal: 'Full weekend',
    current: 0,
    target: 2,
    status: 'locked',
    xp: 100,
  },
  {
    id: '9',
    name: 'Week of Focus',
    description: '7 consecutive healthy days',
    type: 'streak',
    goal: '7 day streak',
    current: 0,
    target: 7,
    status: 'locked',
    xp: 250,
  },
  {
    id: '10',
    name: 'Pet Protector',
    description: 'Keep the same pet alive for 14 days total',
    type: 'milestone',
    goal: '14 days alive',
    current: 0,
    target: 14,
    status: 'locked',
    xp: 400,
  },
];

type PetData = {
  id: string;
  type: string;
  name: string;
  title: string;
  createdAt: string;
  health?: number;
  happiness?: number;
  scrollLimit?: number;
  totalScrollToday?: number;
  lastHealthUpdate?: string;
  lastScrollDate?: string;
  usageBaselineMinutes?: number;
  usageBaselineDate?: string;
};

function PixelBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={{ height: 14, backgroundColor: '#1a1a1a', padding: 2, borderRadius: 6 }}>
      <View style={{ flex: 1, backgroundColor: '#2a2a2a', overflow: 'hidden', borderRadius: 6 }}>
        <View style={{ width: `${value}%`, height: '100%', backgroundColor: color }} />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${value}%`,
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.35)',
          }}
        />
      </View>
    </View>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const isLocked = challenge.status === 'locked';
  const isFailed = challenge.status === 'failed';
  const isCompleted = challenge.status === 'completed';
  const isInProgress = challenge.status === 'in_progress' || challenge.status === 'available';
  const progress = Math.min(100, (challenge.current / challenge.target) * 100);

  return (
    <View style={styles.powerCard}>
      <View style={styles.powerLeft}>
        <View style={styles.powerIcon}>
          {isLocked ? (
            <Image source={LOCK_ICON} style={{ width: 28, height: 28 }} contentFit="contain" />
          ) : isCompleted ? (
            <Ionicons name="checkmark" size={18} color="#fff" />
          ) : isFailed ? (
            <Ionicons name="refresh" size={16} color="#fff" />
          ) : challenge.id === '1' ? (
            <Image source={FIRST_LIGHT_ICON} style={{ width: 28, height: 28 }} contentFit="contain" />
          ) : (
            <Text style={styles.powerXp}>{challenge.xp}</Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.powerTitle} numberOfLines={1}>
            {challenge.name}
          </Text>
          <Text style={styles.powerMeta} numberOfLines={1}>
            {isLocked
              ? 'Locked'
              : isFailed
              ? 'Failed — resets at midnight'
              : isCompleted
              ? 'Completed'
              : `${challenge.current}/${challenge.target} • ${challenge.goal}`}
          </Text>

          {isInProgress && challenge.target > 1 && (
            <View
              style={{
                height: 4,
                backgroundColor: '#f0e6e0',
                borderRadius: 2,
                marginTop: 6,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#B83F3F',
                  borderRadius: 2,
                }}
              />
            </View>
          )}
        </View>
      </View>
      <Text style={styles.powerChevron}>{isFailed ? '↺' : '›'}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [pet, setPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animFrame, setAnimFrame] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [challengesExpanded, setChallengesExpanded] = useState(false);

  const [health, setHealth] = useState(100);
  const [happiness, setHappiness] = useState(100);
  const [scrollMinutes, setScrollMinutes] = useState(0);
  const [scrollLimit, setScrollLimit] = useState(45);
  const [hasUsagePermission, setHasUsagePermission] = useState<boolean | null>(null);

  const [challenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  const level = 12;
  const isHealthy = scrollMinutes <= scrollLimit;
  const completedCount = challenges.filter((c) => c.status === 'completed').length;

  const badges = [
    { id: '1', name: 'Sun Gazer', type: 'sun' as const, unlocked: completedCount >= 1 },
    { id: '2', name: 'Focus King', type: 'focus' as const, unlocked: completedCount >= 2 },
    { id: '3', name: 'Deep Sleeper', type: 'sleep' as const, unlocked: completedCount >= 3 },
    { id: '4', name: 'Bookworm', type: 'book' as const, unlocked: completedCount >= 4 },
  ];

  const visibleChallenges = challengesExpanded ? challenges : challenges.slice(0, 4);

  // ─────────────────────────────────────────────
  // CORE: Load pet + real usage with baseline
  // ─────────────────────────────────────────────
  const loadPetAndUsage = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists() || !userDoc.data()?.pet) {
        setLoading(false);
        return;
      }

      const raw = userDoc.data().pet as PetData;
      setPet(raw);

      const granted = await checkAndRequestUsagePermission();
      setHasUsagePermission(granted);

      let minutes = 0;
      let baselineMinutes = raw.usageBaselineMinutes ?? 0;
      let baselineDate = raw.usageBaselineDate ?? '';

      if (granted) {
        const result = await getPetScrollMinutes(
          baselineMinutes,
          baselineDate,
          raw.createdAt
        );
        minutes = result.minutes;
        baselineMinutes = result.newBaseline;
        baselineDate = result.newBaselineDate;
      } else {
        minutes = raw.totalScrollToday ?? 0;
      }

      const prev: PetHealthState = {
        health: raw.health ?? 100,
        happiness: raw.happiness ?? 100,
        scrollLimit: raw.scrollLimit ?? 45,
        totalScrollToday: raw.totalScrollToday ?? 0,
        lastHealthUpdate: raw.lastHealthUpdate ?? new Date().toISOString(),
        lastScrollDate: raw.lastScrollDate ?? getUTCDateKey(),
      };

      const next = applyHealthTick(prev, minutes);

      setHealth(next.health);
      setHappiness(next.happiness);
      setScrollMinutes(next.totalScrollToday);
      setScrollLimit(next.scrollLimit);

      // ── Build / update usage history (UTC keys) ──
      const todayKey = getUTCDateKey();
      const existingHistory: Record<string, number> =
        userDoc.data()?.usageHistory ?? {};

      let updatedHistory: Record<string, number> = {
        ...existingHistory,
        [todayKey]: minutes,
      };

      // Keep only the last ~90 days
      const sortedKeys = Object.keys(updatedHistory).sort();
      if (sortedKeys.length > 90) {
        const keep = sortedKeys.slice(-90);
        const trimmed: Record<string, number> = {};
        keep.forEach((k) => {
          trimmed[k] = updatedHistory[k];
        });
        updatedHistory = trimmed;
      }

      // Save pet state + history together
      await setDoc(
        userRef,
        {
          pet: {
            ...raw,
            ...next,
            usageBaselineMinutes: baselineMinutes,
            usageBaselineDate: baselineDate,
          },
          usageHistory: updatedHistory,
        },
        { merge: true }
      );
    } catch (error) {
      console.log('Error loading pet/usage:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Run on first mount
  useEffect(() => {
    loadPetAndUsage();
  }, [loadPetAndUsage]);

  // Also re-run every time the user comes back to this screen
  useFocusEffect(
    useCallback(() => {
      loadPetAndUsage();
    }, [loadPetAndUsage])
  );

  const animState = getAnimState(health);
  const frames = PET_FRAMES[pet?.type ?? '']?.[animState] ?? PET_FRAMES.Nugget.happy;
  const petImage = frames[animFrame % frames.length];

  useEffect(() => {
    setAnimFrame(0);
    if (animState !== 'happy' || frames.length < 2) return;

    const id = setInterval(() => {
      setAnimFrame((prev) => (prev + 1) % frames.length);
    }, 2000);

    return () => clearInterval(id);
  }, [pet?.type, animState, frames.length]);

  const handleLogout = () => {
    setMenuOpen(false);
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoggingOut(true);
            await signOut();
            router.replace('/(auth)/login');
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not log out');
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handleRequestPermission = async () => {
    const granted = await checkAndRequestUsagePermission();
    setHasUsagePermission(granted);
    if (granted) {
      await loadPetAndUsage();
    }
  };

  const petName = pet?.name || 'Your Pet';

  const getHealthColor = (val: number) => {
    if (val >= 50) return '#4ade80';
    if (val >= 20) return '#facc15';
    return '#f87171';
  };

  const getHappinessColor = (val: number) => {
    if (val >= 50) return '#60a5fa';
    if (val >= 20) return '#facc15';
    return '#f87171';
  };

  const LayToRestButton = () =>
    health <= 0 ? (
      <Pressable
        onPress={() => router.push('/rest')}
        style={{
          marginTop: 10,
          backgroundColor: '#B83F3F',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          alignSelf: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>Lay to rest</Text>
      </Pressable>
    ) : null;

  const PermissionBanner = () => {
    if (hasUsagePermission !== false) return null;

    return (
      <Pressable
        onPress={handleRequestPermission}
        style={{
          backgroundColor: '#FFF1F2',
          borderWidth: 1.5,
          borderColor: '#FECACA',
          borderRadius: 14,
          padding: 14,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Ionicons name="warning" size={22} color="#B83F3F" />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '800', fontSize: 14, color: '#1a1a1a' }}>
            Enable Usage Access
          </Text>
          <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
            Required to track real scroll time
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#B83F3F" />
      </Pressable>
    );
  };

  const HeaderMenu = () => (
    <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }} onPress={() => setMenuOpen(false)}>
        <View
          style={{
            position: 'absolute',
            top: 56,
            right: isLandscape ? 24 : 18,
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
            minWidth: 180,
            paddingVertical: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Pressable
            style={{ paddingHorizontal: 16, paddingVertical: 14 }}
            onPress={() => {
              setMenuOpen(false);
              Alert.alert('Profile', 'Profile screen coming soon.');
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' }}>Profile</Text>
          </Pressable>

          <View style={{ height: 1, backgroundColor: '#f0e6e0', marginHorizontal: 12 }} />

          <Pressable
            style={{ paddingHorizontal: 16, paddingVertical: 14 }}
            onPress={() => {
              setMenuOpen(false);
              Alert.alert('Settings', 'Settings screen coming soon.');
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' }}>Settings</Text>
          </Pressable>

          <View style={{ height: 1, backgroundColor: '#f0e6e0', marginHorizontal: 12 }} />

          <Pressable style={{ paddingHorizontal: 16, paddingVertical: 14 }} onPress={handleLogout}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#B83F3F' }}>Log out</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  const ChallengesSection = ({ landscape = false }: { landscape?: boolean }) => (
    <>
      <Text style={landscape ? styles.sectionTitleLandscape : styles.sectionTitle}>CHALLENGES</Text>
      <View style={landscape ? styles.powerListLandscape : styles.powerList}>
        {visibleChallenges.map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}
      </View>
      {challenges.length > 4 && (
        <Pressable
          onPress={() => setChallengesExpanded((prev) => !prev)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 10,
            marginBottom: landscape ? 22 : 28,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#B83F3F' }}>
            {challengesExpanded ? 'Show less' : `Show all ${challenges.length} challenges`}
          </Text>
          <Ionicons
            name={challengesExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#B83F3F"
          />
        </Pressable>
      )}
    </>
  );

  const BadgesSection = ({ landscape = false }: { landscape?: boolean }) => (
    <>
      <Text style={landscape ? styles.sectionTitleLandscape : styles.sectionTitle}>BADGES</Text>
      <View style={landscape ? styles.badgesRowLandscape : styles.badgesRow}>
        {badges.map((b) => (
          <View key={b.id} style={landscape ? styles.badgeCardLandscape : styles.badgeCard}>
            {!b.unlocked ? (
              <Image
                source={LOCK_ICON}
                style={{ width: landscape ? 34 : 42, height: landscape ? 34 : 42 }}
                contentFit="contain"
              />
            ) : b.type === 'sun' ? (
              <Image
                source={SUN_BADGE}
                style={{ width: landscape ? 34 : 42, height: landscape ? 34 : 42 }}
                contentFit="contain"
              />
            ) : (
              <BadgeIcon size={landscape ? 34 : 42} type={b.type} />
            )}
            <Text style={landscape ? styles.badgeNameLandscape : styles.badgeName} numberOfLines={1}>
              {b.name}
            </Text>
          </View>
        ))}
      </View>
    </>
  );

  if (loading || loggingOut) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B83F3F" />
      </SafeAreaView>
    );
  }

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <SafeAreaView style={styles.landscapeSafe} edges={['top', 'left', 'right']}>
        <HeaderMenu />
        <View style={styles.landscapeRow}>
          <View style={styles.landscapePetCard}>
            <View
              style={{
                width: '100%',
                paddingHorizontal: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={styles.landscapeLevel}>LVL {level}</Text>
              <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
                <Ionicons name="settings-outline" size={22} color="#1a1a1a" />
              </Pressable>
            </View>

            <View style={styles.landscapePetCircle}>
              <Image source={petImage} style={{ width: '86%', height: '86%' }} contentFit="contain" />
            </View>

            <Text style={styles.landscapePetName}>{petName}</Text>
            <LayToRestButton />
          </View>

          <View style={styles.landscapeWhiteCard}>
            <ScrollView contentContainerStyle={styles.landscapeScrollContent} showsVerticalScrollIndicator={false}>
              <PermissionBanner />

              <View style={styles.barsRowLandscape}>
                <View style={styles.barBlock}>
                  <View style={styles.barLabelRowLandscape}>
                    <Text style={styles.barLabelLandscape}>HEALTH</Text>
                    <Text style={styles.barValueLandscape}>{health}%</Text>
                  </View>
                  <PixelBar value={health} color={getHealthColor(health)} />
                </View>

                <View style={styles.barBlock}>
                  <View style={styles.barLabelRowLandscape}>
                    <Text style={styles.barLabelLandscape}>HAPPINESS</Text>
                    <Text style={styles.barValueLandscape}>{happiness}%</Text>
                  </View>
                  <PixelBar value={happiness} color={getHappinessColor(happiness)} />
                </View>
              </View>

              <Text style={styles.sectionTitleLandscape}>TODAY'S FOCUS</Text>

              <View
                style={[
                  styles.focusCardLandscape,
                  {
                    backgroundColor: isHealthy ? '#F0FDF4' : '#FFF1F2',
                    borderColor: isHealthy ? '#E2F5E9' : '#FDE8E8',
                  },
                ]}
              >
                <View>
                  <Text style={styles.focusLabelLandscape}>SCROLL TIME</Text>
                  <Text style={styles.focusValueLandscape}>{scrollMinutes}m</Text>
                </View>
                <View style={styles.focusRightLandscape}>
                  <View
                    style={[
                      styles.statusPillLandscape,
                      { backgroundColor: isHealthy ? '#DCFCE7' : '#FEE2E2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTextLandscape,
                        { color: isHealthy ? '#16a34a' : '#dc2626' },
                      ]}
                    >
                      {isHealthy ? 'LOOKING GOOD' : 'TOO MUCH'}
                    </Text>
                  </View>
                  <Text style={styles.limitTextLandscape}>LIMIT {scrollLimit}M</Text>
                </View>
              </View>

              <ChallengesSection landscape />
              <BadgesSection landscape />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== PORTRAIT ====================
  return (
    <SafeAreaView style={styles.portraitSafe} edges={['top']}>
      <HeaderMenu />
      <View style={{ flex: 1 }}>
        <View style={styles.portraitHero}>
          <View style={styles.portraitHeaderRow}>
            <Text style={styles.portraitLevel}>LVL {level}</Text>
            <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
              <Ionicons name="settings-outline" size={22} color="#1a1a1a" />
            </Pressable>
          </View>

          <View style={styles.portraitPetCircle}>
            <Image source={petImage} style={{ width: '85%', height: '85%' }} contentFit="contain" />
          </View>

          <Text style={styles.portraitPetName}>{petName}</Text>
          <LayToRestButton />
        </View>

        <View style={styles.portraitWhiteCard}>
          <ScrollView contentContainerStyle={styles.portraitScrollContent} showsVerticalScrollIndicator={false}>
            <PermissionBanner />

            <View style={styles.barsRow}>
              <View style={styles.barBlock}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>HEALTH</Text>
                  <Text style={styles.barValue}>{health}%</Text>
                </View>
                <PixelBar value={health} color={getHealthColor(health)} />
              </View>

              <View style={styles.barBlock}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>HAPPINESS</Text>
                  <Text style={styles.barValue}>{happiness}%</Text>
                </View>
                <PixelBar value={happiness} color={getHappinessColor(happiness)} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>TODAY'S FOCUS</Text>

            <View
              style={[
                styles.focusCard,
                {
                  backgroundColor: isHealthy ? '#F0FDF4' : '#FFF1F2',
                  borderColor: isHealthy ? '#E2F5E9' : '#FDE8E8',
                },
              ]}
            >
              <View>
                <Text style={styles.focusLabel}>SCROLL TIME</Text>
                <Text style={styles.focusValue}>{scrollMinutes}m</Text>
              </View>
              <View style={styles.focusRight}>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isHealthy ? '#DCFCE7' : '#FEE2E2' },
                  ]}
                >
                  <Text style={[styles.statusText, { color: isHealthy ? '#16a34a' : '#dc2626' }]}>
                    {isHealthy ? 'LOOKING GOOD' : 'TOO MUCH'}
                  </Text>
                </View>
                <Text style={styles.limitText}>LIMIT {scrollLimit}M</Text>
              </View>
            </View>

            <ChallengesSection />
            <BadgesSection />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}