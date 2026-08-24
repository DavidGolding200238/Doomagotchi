import ProfileModal from '@/components/ProfileModal';
import SettingsModal from '@/components/SettingsModal';
import { useAuth } from '@/context/AuthContext';
import {
  processPetNotifications,
  type NotifyBand,
} from '@/services/background';
import {
  badgeUnlockCount,
  buildChallengeViews,
  emptyChallengeState,
  evaluateChallenges,
  type ChallengeState,
  type ChallengeView,
} from '@/services/challenges';
import { db } from '@/services/firebase';
import { applyHealthTick, type PetHealthState } from '@/services/health';
import {
  getMinutesInRange,
  getPetScrollMinutes,
  getUTCDateKey,
  hasUsagePermission,
  requestUsagePermission,
  resolveTrackedPackages,
} from '@/services/usage';
import { styles } from '@/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  type DimensionValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─────────────────────────────────────────────
// PET ASSETS
// ─────────────────────────────────────────────
const DUCK_IDLE = require('@/assets/pets/Duck/Duck Idle.gif');
const DUCK_WALK = require('@/assets/pets/Duck/Duck Walk.gif');
const DUCK_SICK = require('@/assets/pets/Duck/Duck Sick.gif');
const DUCK_DEAD = require('@/assets/pets/Duck/Duck Dead.gif');

const SPINO_IDLE = require('@/assets/pets/Spinosaurus/Idle Spino.gif');
const SPINO_WALK = require('@/assets/pets/Spinosaurus/Walking Spino.gif');
const SPINO_SICK = require('@/assets/pets/Spinosaurus/Sick Spino.gif');
const SPINO_DEAD = require('@/assets/pets/Spinosaurus/Dead spino.gif');
const SPINO_RARE = require('@/assets/pets/Spinosaurus/Easter Egg.gif');

const PANDA_IDLE = require('@/assets/pets/Panda/Panda Idle.gif');
const PANDA_EATING = require('@/assets/pets/Panda/Panda Eating.gif');
const PANDA_SICK = require('@/assets/pets/Panda/Sick Panda.gif');
const PANDA_DEAD = require('@/assets/pets/Panda/Dead Panda.gif');

// ─────────────────────────────────────────────
// CHALLENGE ICONS
// ─────────────────────────────────────────────
const ICON_FIRST_LIGHT = require('@/assets/Icons/First Light.png');
const ICON_NO_REELS_NIGHT = require('@/assets/Icons/No Reels Night.png');
const ICON_TWO_DAY_STREAK = require('@/assets/Icons/Two-Day Streak.png');
const ICON_SCROLL_FAST = require('@/assets/Icons/Scroll Fast.png');
const ICON_THREE_DAY_STREAK = require('@/assets/Icons/Three-Day Streak.png');
const ICON_MORNING_MUTE = require('@/assets/Icons/Morning Mute.png');
const ICON_FIVE_DAY_GUARDIAN = require('@/assets/Icons/Five-Day Guardian.png');
const ICON_WEEKEND_WARRIOR = require('@/assets/Icons/Weekend Warrior.png');
const ICON_WEEK_OF_FOCUS = require('@/assets/Icons/Week of Focus.png');
const ICON_PET_PROTECTOR = require('@/assets/Icons/Pet Protector.png');

// ─────────────────────────────────────────────
// BADGE ICONS
// ─────────────────────────────────────────────
const BADGE_SUN_GAZER = require('@/assets/Badges/Sun Gazer.png');
const BADGE_FOCUS_KING = require('@/assets/Badges/Focus King.png');
const BADGE_DEEP_SLEEPER = require('@/assets/Badges/Deep Sleeper.png');
const BADGE_BOOK_WORM = require('@/assets/Badges/Book Worm.png');

const LOCK_ICON = require('@/assets/images/Lock icon.png');
const SETTINGS_ICON = require('@/assets/images/Settings Icon.png');

const CHALLENGE_ICONS: Record<string, any> = {
  '1': ICON_FIRST_LIGHT,
  '2': ICON_NO_REELS_NIGHT,
  '3': ICON_TWO_DAY_STREAK,
  '4': ICON_SCROLL_FAST,
  '5': ICON_THREE_DAY_STREAK,
  '6': ICON_MORNING_MUTE,
  '7': ICON_FIVE_DAY_GUARDIAN,
  '8': ICON_WEEKEND_WARRIOR,
  '9': ICON_WEEK_OF_FOCUS,
  '10': ICON_PET_PROTECTOR,
};

const BADGE_UNLOCK_CONDITIONS: Record<string, string> = {
  '1': 'Complete 2 challenges',
  '2': 'Complete 4 challenges',
  '3': 'Complete 6 challenges',
  '4': 'Complete all 10 challenges',
};

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
  challenges?: ChallengeState;
  lastNotifiedBand?: NotifyBand;
  lastNotifiedHealth?: number;
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

function PetDisplay({
  petType,
  health,
  sizePercent = '85%',
}: {
  petType?: string;
  health: number;
  sizePercent?: DimensionValue;
}) {
  const [animFrame, setAnimFrame] = useState(0);
  const [showRare, setShowRare] = useState(false);

  const animState = getAnimState(health);
  const frames = PET_FRAMES[petType ?? '']?.[animState] ?? PET_FRAMES.Nugget.happy;

  const petImage =
    showRare && petType === 'Spino' && animState === 'happy'
      ? SPINO_RARE
      : frames[animFrame % frames.length];

  useEffect(() => {
    setAnimFrame(0);
    setShowRare(false);

    if (animState !== 'happy' || frames.length < 2) return;

    const id = setInterval(() => {
      if (petType === 'Spino' && Math.random() < 0.05) {
        setShowRare(true);
        setTimeout(() => setShowRare(false), 4000);
        return;
      }

      setShowRare(false);
      setAnimFrame((prev) => (prev + 1) % frames.length);
    }, 2000);

    return () => clearInterval(id);
  }, [petType, animState, frames.length]);

  return (
    <Image
      source={petImage}
      style={{ width: sizePercent, height: sizePercent }}
      contentFit="contain"
    />
  );
}

const ChallengeCard = React.memo(function ChallengeCard({
  challenge,
  onPress,
}: {
  challenge: ChallengeView;
  onPress: () => void;
}) {
  const isLocked = challenge.status === 'locked';
  const isCompleted = challenge.status === 'completed';
  const icon = CHALLENGE_ICONS[challenge.id];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.powerCard, isCompleted && styles.powerCardCompleted]}
    >
      <View style={styles.powerLeft}>
        <View style={[styles.powerIcon, styles.powerIconNeutral]}>
          {isLocked ? (
            <Image source={LOCK_ICON} style={{ width: 28, height: 28 }} contentFit="contain" />
          ) : icon ? (
            <Image source={icon} style={{ width: 28, height: 28 }} contentFit="contain" />
          ) : (
            <Ionicons name="checkmark" size={18} color="#1a1a1a" />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.powerTitle} numberOfLines={1}>
            {challenge.name}
          </Text>
          <Text style={styles.powerMeta} numberOfLines={1}>
            {isLocked ? 'Locked' : isCompleted ? 'Completed' : challenge.goal}
          </Text>
        </View>
      </View>
      <Text style={[styles.powerChevron, isCompleted && styles.powerChevronCompleted]}>
        {isCompleted ? '✓' : '›'}
      </Text>
    </Pressable>
  );
});

function ChallengeDetailModal({
  challenge,
  visible,
  onClose,
}: {
  challenge: ChallengeView | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!challenge) return null;

  const isLocked = challenge.status === 'locked';
  const isCompleted = challenge.status === 'completed';
  const icon = CHALLENGE_ICONS[challenge.id];

  const statusLabel = isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Available';
  const statusColor = isCompleted ? '#C4A35A' : isLocked ? '#999' : '#16a34a';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.challengeModalOverlay} onPress={onClose}>
        <Pressable style={styles.challengeModalCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.challengeModalIconWrap}>
            {isLocked ? (
              <Image source={LOCK_ICON} style={{ width: 36, height: 36 }} contentFit="contain" />
            ) : icon ? (
              <Image source={icon} style={{ width: 36, height: 36 }} contentFit="contain" />
            ) : null}
          </View>

          <Text style={styles.challengeModalTitle}>{challenge.name}</Text>
          <Text style={[styles.challengeModalStatus, { color: statusColor }]}>{statusLabel}</Text>

          <Text style={styles.challengeModalDescription}>{challenge.description}</Text>

          <View style={styles.challengeModalMetaRow}>
            <View style={styles.challengeModalMetaPill}>
              <Text style={styles.challengeModalMetaText}>{challenge.goal}</Text>
            </View>
            <View style={styles.challengeModalMetaPill}>
              <Text style={styles.challengeModalMetaText}>{challenge.type}</Text>
            </View>
          </View>

          <Pressable style={styles.challengeModalClose} onPress={onClose}>
            <Text style={styles.challengeModalCloseText}>Got it</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const BadgeCard = React.memo(function BadgeCard({
  id,
  name,
  icon,
  unlocked,
  landscape,
}: {
  id: string;
  name: string;
  icon: any;
  unlocked: boolean;
  landscape: boolean;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const flip = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const cardStyle = [
    landscape ? styles.badgeCardLandscape : styles.badgeCard,
    unlocked && styles.badgeCardUnlocked,
  ];

  return (
    <Pressable onPress={flip} style={{ flex: 1 }}>
      <Animated.View
        style={[
          cardStyle,
          {
            transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
            backfaceVisibility: 'hidden',
            position: flipped ? 'absolute' : 'relative',
            width: '100%',
          },
        ]}
      >
        {unlocked ? (
          <Image
            source={icon}
            style={{ width: landscape ? 34 : 42, height: landscape ? 34 : 42 }}
            contentFit="contain"
          />
        ) : (
          <Image
            source={LOCK_ICON}
            style={{ width: landscape ? 34 : 42, height: landscape ? 34 : 42 }}
            contentFit="contain"
          />
        )}
        <Text style={landscape ? styles.badgeNameLandscape : styles.badgeName} numberOfLines={1}>
          {name}
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          cardStyle,
          {
            transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
            backfaceVisibility: 'hidden',
            position: flipped ? 'relative' : 'absolute',
            width: '100%',
            top: 0,
            left: 0,
          },
        ]}
      >
        <Text style={styles.badgeBackLabel}>UNLOCK</Text>
        <Text style={landscape ? styles.badgeBackTextLandscape : styles.badgeBackText}>
          {BADGE_UNLOCK_CONDITIONS[id]}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [pet, setPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [challengesExpanded, setChallengesExpanded] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeView | null>(null);

  const [health, setHealth] = useState(100);
  const [happiness, setHappiness] = useState(100);
  const [scrollMinutes, setScrollMinutes] = useState(0);
  const [scrollLimit, setScrollLimit] = useState(45);
  const [hasUsagePermissionState, setHasUsagePermissionState] = useState<boolean | null>(null);

  const [challengeViews, setChallengeViews] = useState<ChallengeView[]>(
    buildChallengeViews(emptyChallengeState())
  );

  const isHealthy = scrollMinutes <= scrollLimit;
  const completedCount = challengeViews.filter((c) => c.status === 'completed').length;
  const unlockedBadgeCount = badgeUnlockCount(completedCount);

  const badges = useMemo(
    () => [
      { id: '1', name: 'Sun Gazer', icon: BADGE_SUN_GAZER, unlocked: unlockedBadgeCount >= 1 },
      { id: '2', name: 'Focus King', icon: BADGE_FOCUS_KING, unlocked: unlockedBadgeCount >= 2 },
      { id: '3', name: 'Deep Sleeper', icon: BADGE_DEEP_SLEEPER, unlocked: unlockedBadgeCount >= 3 },
      { id: '4', name: 'Book Worm', icon: BADGE_BOOK_WORM, unlocked: unlockedBadgeCount >= 4 },
    ],
    [unlockedBadgeCount]
  );

  const visibleChallenges = useMemo(
    () => (challengesExpanded ? challengeViews : challengeViews.slice(0, 4)),
    [challengesExpanded, challengeViews]
  );

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

      // Settings toggles → only these packages count toward limit / health
      const trackedPackages = resolveTrackedPackages(
        userDoc.data()?.trackedAppIds ?? null
      );

      const granted = await hasUsagePermission();
      setHasUsagePermissionState(granted);

      const todayKey = getUTCDateKey();
      const createdDate = raw.createdAt ? raw.createdAt.slice(0, 10) : null;
      const isCreationDay = createdDate === todayKey;

      let minutes = 0;
      let baselineMinutes = raw.usageBaselineMinutes ?? 0;
      let baselineDate = raw.usageBaselineDate ?? '';

      if (granted) {
        const result = await getPetScrollMinutes(
          baselineMinutes,
          baselineDate,
          raw.createdAt,
          trackedPackages
        );
        minutes = result.minutes;
        baselineMinutes = result.newBaseline;
        baselineDate = result.newBaselineDate;

        // ─────────────────────────────────────────────────────────
        // HARD GUARD: brand-new pets must never inherit the day's
        // pre-existing social usage. If baseline is missing or not
        // locked to today, force 0 minutes and lock the baseline.
        // This stops the "500m from nowhere → instant death" bug.
        // ─────────────────────────────────────────────────────────
        if (isCreationDay) {
          if (!raw.usageBaselineDate || raw.usageBaselineDate !== todayKey) {
            minutes = 0;
            // baselineMinutes / baselineDate already set to raw by getPetScrollMinutes
          }
        }
      } else {
        minutes = raw.totalScrollToday ?? 0;
      }

      // Extra safety: on creation day never let totalScrollToday start
      // from a non-zero value that could cause a huge overage delta.
      const safePrevTotal =
        isCreationDay && (!raw.usageBaselineDate || raw.usageBaselineDate !== todayKey)
          ? 0
          : (raw.totalScrollToday ?? 0);

      const prev: PetHealthState = {
        health: raw.health ?? 100,
        happiness: raw.happiness ?? 100,
        scrollLimit: raw.scrollLimit ?? 45,
        totalScrollToday: safePrevTotal,
        lastHealthUpdate: raw.lastHealthUpdate ?? new Date().toISOString(),
        lastScrollDate: raw.lastScrollDate ?? todayKey,
      };

      const next = applyHealthTick(prev, minutes);

      setHealth(next.health);
      setHappiness(next.happiness);
      setScrollMinutes(next.totalScrollToday);
      setScrollLimit(next.scrollLimit);

      const notify = await processPetNotifications({
        petName: raw.name || 'Your pet',
        prevHealth: prev.health,
        nextHealth: next.health,
        minutes,
        scrollLimit: next.scrollLimit,
        lastNotifiedBand: raw.lastNotifiedBand,
        lastNotifiedHealth: raw.lastNotifiedHealth,
      });

      // ─────────────────────────────────────────────────────────
      // CHALLENGE INHERITANCE FIX
      // First Light needs a FULL finished day AFTER creation.
      // No challenge can legitimately complete while daysAlive < 2.
      // Force empty state so a brand-new pet never shows First Light
      // (or any challenge) as already done.
      // ─────────────────────────────────────────────────────────
      let challengeState = raw.challenges ?? emptyChallengeState();

      const createdStart = new Date(raw.createdAt);
      createdStart.setUTCHours(0, 0, 0, 0);
      const nowStart = new Date();
      nowStart.setUTCHours(0, 0, 0, 0);
      const daysAlive =
        Math.floor((nowStart.getTime() - createdStart.getTime()) / 86_400_000) + 1;

      if (daysAlive < 2) {
        challengeState = emptyChallengeState();
      } else if (granted) {
        try {
          challengeState = await evaluateChallenges({
            existing: challengeState,
            scrollLimit: next.scrollLimit,
            createdAt: raw.createdAt,
            health: next.health,
            packages: trackedPackages,
          });
        } catch (e) {
          console.log('Challenge evaluate error:', e);
        }
      }

      setChallengeViews(buildChallengeViews(challengeState));

      const existingHistory: Record<string, number> =
        userDoc.data()?.usageHistory ?? {};

      // Backfill last 14 UTC days from UsageStats so graph days are not
      // empty when the app was never opened that day (e.g. Saturday).
      let updatedHistory: Record<string, number> = { ...existingHistory };
      if (granted) {
        const nowMs = Date.now();
        for (let i = 0; i < 14; i++) {
          const day = new Date();
          day.setUTCHours(12, 0, 0, 0);
          day.setUTCDate(day.getUTCDate() - i);
          const key = getUTCDateKey(day);
          const start = new Date(day);
          start.setUTCHours(0, 0, 0, 0);
          const end = new Date(day);
          end.setUTCHours(23, 59, 59, 999);
          const endMs = Math.min(end.getTime(), nowMs);
          if (endMs <= start.getTime()) continue;
          try {
            updatedHistory[key] = await getMinutesInRange(
              start.getTime(),
              endMs,
              trackedPackages
            );
          } catch {
            // keep existing
          }
        }
      } else {
        updatedHistory[todayKey] = minutes;
      }

      const sortedKeys = Object.keys(updatedHistory).sort();
      if (sortedKeys.length > 90) {
        const keep = sortedKeys.slice(-90);
        const trimmed: Record<string, number> = {};
        keep.forEach((k) => {
          trimmed[k] = updatedHistory[k];
        });
        updatedHistory = trimmed;
      }

      await setDoc(
        userRef,
        {
          pet: {
            ...raw,
            ...next,
            usageBaselineMinutes: baselineMinutes,
            usageBaselineDate: baselineDate,
            challenges: challengeState,
            lastNotifiedBand: notify.lastNotifiedBand,
            lastNotifiedHealth: notify.lastNotifiedHealth,
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

  useEffect(() => {
    loadPetAndUsage();
  }, [loadPetAndUsage]);

  useEffect(() => {
    if (!user) return;

    const id = setInterval(() => {
      loadPetAndUsage();
    }, 45_000);

    return () => clearInterval(id);
  }, [user, loadPetAndUsage]);

  useFocusEffect(
    useCallback(() => {
      loadPetAndUsage();
    }, [loadPetAndUsage])
  );

  const handleLogout = () => {
    setMenuOpen(false);
    setProfileOpen(false);
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
    await requestUsagePermission();
    const granted = await hasUsagePermission();
    setHasUsagePermissionState(granted);
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
      <Pressable onPress={() => router.push('/rest')} style={styles.layToRestButton}>
        <Text style={styles.layToRestText}>Lay to rest</Text>
      </Pressable>
    ) : null;

  const PermissionBanner = () => {
    if (hasUsagePermissionState !== false) return null;

    return (
      <Pressable onPress={handleRequestPermission} style={styles.permissionBanner}>
        <Ionicons name="warning" size={22} color="#B83F3F" />
        <View style={{ flex: 1 }}>
          <Text style={styles.permissionTitle}>Enable Usage Access</Text>
          <Text style={styles.permissionSubtitle}>Required to track real scroll time</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#B83F3F" />
      </Pressable>
    );
  };

  const HeaderMenu = () => (
    <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
      <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
        <View style={[styles.menuCard, { right: isLandscape ? 24 : 18 }]}>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              setProfileOpen(true);
            }}
          >
            <Text style={styles.menuItemText}>Profile</Text>
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              setSettingsOpen(true);
            }}
          >
            <Text style={styles.menuItemText}>Settings</Text>
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuItemTextDanger}>Log out</Text>
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
          <ChallengeCard
            key={c.id}
            challenge={c}
            onPress={() => setSelectedChallenge(c)}
          />
        ))}
      </View>
      {challengeViews.length > 4 && (
        <Pressable
          onPress={() => setChallengesExpanded((prev) => !prev)}
          style={[styles.expandButton, { marginBottom: landscape ? 22 : 28 }]}
        >
          <Text style={styles.expandButtonText}>
            {challengesExpanded
              ? 'Show less'
              : `Show all ${challengeViews.length} challenges`}
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
          <BadgeCard
            key={b.id}
            id={b.id}
            name={b.name}
            icon={b.icon}
            unlocked={b.unlocked}
            landscape={landscape}
          />
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

  if (isLandscape) {
    return (
      <SafeAreaView style={styles.landscapeSafe} edges={['top', 'left', 'right']}>
        <HeaderMenu />
        <ProfileModal
          visible={profileOpen}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
        />
        <SettingsModal
          visible={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
        <ChallengeDetailModal
          challenge={selectedChallenge}
          visible={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
        <View style={styles.landscapeRow}>
          <View style={styles.landscapePetCard}>
            <View style={styles.landscapeHeaderRow}>
              <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
                <Image
                  source={SETTINGS_ICON}
                  style={{ width: 22, height: 22 }}
                  contentFit="contain"
                />
              </Pressable>
            </View>

            <View style={styles.landscapePetCircle}>
              <PetDisplay petType={pet?.type} health={health} sizePercent="86%" />
            </View>

            <Text style={styles.landscapePetName}>{petName}</Text>
            <LayToRestButton />
          </View>

          <View style={styles.landscapeWhiteCard}>
            <ScrollView
              contentContainerStyle={styles.landscapeScrollContent}
              showsVerticalScrollIndicator={false}
            >
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

  return (
    <SafeAreaView style={styles.portraitSafe} edges={['top']}>
      <HeaderMenu />
      <ProfileModal
        visible={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLogout={handleLogout}
      />
      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <ChallengeDetailModal
        challenge={selectedChallenge}
        visible={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
      />
      <View style={{ flex: 1 }}>
        <View style={styles.portraitHero}>
          <View style={styles.portraitHeaderRow}>
            <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
              <Image
                source={SETTINGS_ICON}
                style={{ width: 22, height: 22 }}
                contentFit="contain"
              />
            </Pressable>
          </View>

          <View style={styles.portraitPetCircle}>
            <PetDisplay petType={pet?.type} health={health} sizePercent="85%" />
          </View>

          <Text style={styles.portraitPetName}>{petName}</Text>
          <LayToRestButton />
        </View>

        <View style={styles.portraitWhiteCard}>
          <ScrollView
            contentContainerStyle={styles.portraitScrollContent}
            showsVerticalScrollIndicator={false}
          >
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
