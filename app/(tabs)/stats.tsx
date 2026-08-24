import ProfileModal from '@/components/ProfileModal';
import SettingsModal from '@/components/SettingsModal';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import {
  getMinutesInRange,
  getPetScrollMinutes,
  getTopEnemyApp,
  getUTCDateKey,
  hasUsagePermission,
  resolveTrackedPackages,
} from '@/services/usage';
import { styles } from '@/styles/stats.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SETTINGS_ICON = require('@/assets/images/Settings Icon.png');

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const INTENSITY_COLORS = ['#E8E4DF', '#F5D76E', '#F0A05A', '#E06B6B', '#C94C4C'];
const INTENSITY_LABELS = ['CLEAN', 'MILD', 'ALERT', 'HIGH', 'CRITICAL'];

const LANDSCAPE_CHART_H = 110;
const PORTRAIT_CHART_H = 130;

function getIntensityLevel(minutes: number, limit: number): number {
  if (minutes <= 0) return 0;
  const ratio = minutes / limit;
  if (ratio < 0.5) return 1;
  if (ratio < 0.9) return 2;
  if (ratio < 1.3) return 3;
  return 4;
}

/**
 * Current calendar week Mon → Sun (UTC).
 * Resets every Monday so the intensity graph starts clean for the new week.
 * Future days in the week stay 0 until data exists.
 */
function getCurrentWeekMonSun(): { key: string; label: string }[] {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const dow = now.getUTCDay(); // 0=Sun … 6=Sat
  const daysFromMonday = dow === 0 ? 6 : dow - 1;

  const monday = new Date(now);
  monday.setUTCHours(12, 0, 0, 0);
  monday.setUTCDate(monday.getUTCDate() - daysFromMonday);

  const result: { key: string; label: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() + i);
    result.push({
      key: getUTCDateKey(d),
      label: labels[i],
    });
  }
  return result;
}

function calculateStreak(history: Record<string, number>, limit: number): number {
  let streak = 0;
  const d = new Date();

  while (true) {
    const key = getUTCDateKey(d);
    const minutes = history[key];

    if (minutes === undefined) break;

    if (minutes <= limit) {
      streak += 1;
      d.setUTCDate(d.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Pull the last N UTC days from Android UsageStats and merge into history.
 * Fixes missing intensity/calendar days when the app wasn't opened that day.
 */
async function backfillUsageHistory(
  existing: Record<string, number>,
  packages: string[],
  dayCount = 14
): Promise<Record<string, number>> {
  const history = { ...existing };
  const nowMs = Date.now();

  for (let i = 0; i < dayCount; i++) {
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
      history[key] = await getMinutesInRange(start.getTime(), endMs, packages);
    } catch {
      // keep existing value if query fails
    }
  }

  return history;
}

export default function StatsScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [scrollLimit, setScrollLimit] = useState(45);
  const [graveyardCount, setGraveyardCount] = useState(0);
  const [topEnemy, setTopEnemy] = useState('—');
  const [streak, setStreak] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [month] = useState(
    new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
  );

  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ]);

  // day: null = padding cell before the 1st of the month
  const [activity, setActivity] = useState<{ day: number | null; level: number }[]>(
    Array.from({ length: 31 }, (_, i) => ({ day: i + 1, level: 0 }))
  );

  const loadStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const graveSnap = await getDocs(collection(db, 'users', user.uid, 'graveyard'));
      setGraveyardCount(graveSnap.size);

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const pet = userData?.pet ?? null;
      const trackedPackages = resolveTrackedPackages(
        userData?.trackedAppIds ?? null
      );

      let minutes = 0;
      let limit = 45;
      let history: Record<string, number> = { ...(userData?.usageHistory ?? {}) };
      let baselineMinutes = pet?.usageBaselineMinutes ?? 0;
      let baselineDate = pet?.usageBaselineDate ?? '';
      let shouldWriteBaseline = false;

      if (pet) {
        limit = pet.scrollLimit ?? 45;

        const granted = await hasUsagePermission();
        if (granted) {
          const result = await getPetScrollMinutes(
            baselineMinutes,
            baselineDate,
            pet.createdAt,
            trackedPackages
          );
          minutes = result.minutes;

          // If baseline was missing / just locked, persist it so Home
          // never sees a brand-new pet without protection.
          if (
            result.newBaselineDate !== baselineDate ||
            result.newBaseline !== baselineMinutes
          ) {
            baselineMinutes = result.newBaseline;
            baselineDate = result.newBaselineDate;
            shouldWriteBaseline = true;
          }

          const enemy = await getTopEnemyApp(trackedPackages);
          setTopEnemy(enemy);
        } else {
          minutes = pet.totalScrollToday ?? 0;
          setTopEnemy('—');
        }
      }

      const todayKey = getUTCDateKey();

      // Backfill last 14 days from system UsageStats so days the app
      // was never opened (e.g. Saturday) still appear on the graphs.
      const grantedForBackfill = await hasUsagePermission();
      if (grantedForBackfill) {
        history = await backfillUsageHistory(history, trackedPackages, 14);
      } else {
        history = {
          ...history,
          [todayKey]: minutes,
        };
      }

      // Keep last 90 days only
      const sortedKeys = Object.keys(history).sort();
      if (sortedKeys.length > 90) {
        const keep = sortedKeys.slice(-90);
        const trimmed: Record<string, number> = {};
        keep.forEach((k) => {
          trimmed[k] = history[k];
        });
        history = trimmed;
      }

      const writePayload: Record<string, unknown> = { usageHistory: history };
      if (shouldWriteBaseline && pet) {
        writePayload.pet = {
          ...pet,
          usageBaselineMinutes: baselineMinutes,
          usageBaselineDate: baselineDate,
        };
      }
      await setDoc(userRef, writePayload, { merge: true });

      setTodayMinutes(minutes);
      setScrollLimit(limit);
      setStreak(calculateStreak(history, limit));

      // ── Weekly intensity data (current Mon → Sun only) ─────────
      // Resets at the start of each week. Previous week does not roll over.
      const thisWeek = getCurrentWeekMonSun();
      const orderedWeek = thisWeek.map((d) => ({
        day: d.label,
        value: history[d.key] ?? 0,
      }));

      setWeeklyData(orderedWeek);
      setWeeklyTotal(orderedWeek.reduce((sum, d) => sum + d.value, 0));

      // ── Monthly activity calendar (UTC) ─────────────────────────
      // Pad leading cells so day 1 lands on the correct weekday column.
      // DAYS header is Sun→Sat, matching Date#getUTCDay() (0=Sun).
      const now = new Date();
      const utcYear = now.getUTCFullYear();
      const utcMonth = now.getUTCMonth();
      const daysInMonth = new Date(Date.UTC(utcYear, utcMonth + 1, 0)).getUTCDate();
      const firstDow = new Date(Date.UTC(utcYear, utcMonth, 1)).getUTCDay(); // 0=Sun

      const monthActivity: { day: number | null; level: number }[] = [];
      for (let i = 0; i < firstDow; i++) {
        monthActivity.push({ day: null, level: 0 });
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const key = `${utcYear}-${String(utcMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayMinutes = history[key] ?? 0;
        monthActivity.push({
          day,
          level: getIntensityLevel(dayMinutes, limit),
        });
      }
      setActivity(monthActivity);
    } catch (err) {
      console.log('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
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
            await signOut();
            router.replace('/(auth)/login');
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not log out');
          }
        },
      },
    ]);
  };

  const HeaderMenu = () => (
    <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
      <Pressable style={menuStyles.overlay} onPress={() => setMenuOpen(false)}>
        <View style={[menuStyles.card, { right: isLandscape ? 24 : 18 }]}>
          <Pressable
            style={menuStyles.item}
            onPress={() => {
              setMenuOpen(false);
              setProfileOpen(true);
            }}
          >
            <Text style={menuStyles.itemText}>Profile</Text>
          </Pressable>

          <View style={menuStyles.divider} />

          <Pressable
            style={menuStyles.item}
            onPress={() => {
              setMenuOpen(false);
              setSettingsOpen(true);
            }}
          >
            <Text style={menuStyles.itemText}>Settings</Text>
          </Pressable>

          <View style={menuStyles.divider} />

          <Pressable style={menuStyles.item} onPress={handleLogout}>
            <Text style={menuStyles.itemTextDanger}>Log out</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  // Visual scale: at least the daily limit, never let one extreme day
  // make every other bar a tiny stub. Cap scale at 3× limit.
  const rawMax = Math.max(...weeklyData.map((d) => d.value), 1);
  const maxBar = Math.max(scrollLimit, Math.min(rawMax, scrollLimit * 3));

  const portraitCalendarWidth = Math.min(width, height) - 36;
  const cardsColumnWidth = 300;

  const statCards = [
    { label: 'DAILY AVG', value: `${todayMinutes}m`, icon: 'time-outline' },
    { label: 'WEEKLY', value: `${weeklyTotal}m`, icon: 'trending-down' },
    { label: 'TOP ENEMY', value: topEnemy, icon: 'phone-portrait-outline' },
    { label: 'STREAK', value: `${streak}D`, icon: 'flash-outline' },
  ];

  /** Pixel height for a bar — clamped so it never leaves the chart box. */
  function barPixelHeight(value: number, chartH: number): number {
    if (value <= 0) return 6;
    const h = (value / maxBar) * chartH;
    return Math.max(6, Math.min(chartH, h));
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={{ flex: 1, backgroundColor: '#FFF9F5', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#B83F3F" />
        </View>
      </SafeAreaView>
    );
  }

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
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
        <View style={{ flex: 1, backgroundColor: '#FFF9F5' }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingTop: 20,
              gap: 70,
            }}
          >
            {/* LEFT — calendar + intensity */}
            <ScrollView
              style={{ width: portraitCalendarWidth, flexGrow: 0, flexShrink: 0 }}
              contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.landscapeCard}>
                <View style={styles.landscapeCardHeader}>
                  <View style={styles.landscapeCardTitleRow}>
                    <Ionicons name="calendar-outline" size={16} color="#1a1a1a" />
                    <Text style={styles.landscapeCardTitle}>ACTIVITY</Text>
                  </View>
                  <View style={styles.landscapeMonthRow}>
                    <Text style={styles.landscapeMonthText}>{month}</Text>
                  </View>
                </View>

                <View style={styles.dayHeaders}>
                  {DAYS.map((d, i) => (
                    <View key={i} style={styles.dayHeaderCell}>
                      <Text style={styles.dayHeaderText}>{d}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.calendarGrid}>
                  {activity.map((cell, i) => (
                    <View key={i} style={styles.calendarCell}>
                      {cell.day === null ? (
                        <View style={[styles.calendarCellInner, { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
                      ) : (
                        <View
                          style={[
                            styles.calendarCellInner,
                            {
                              backgroundColor: INTENSITY_COLORS[cell.level],
                              borderColor: cell.level === 0 ? '#f0e6e0' : 'transparent',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.calendarDayText,
                              { color: cell.level >= 3 ? '#fff' : '#1a1a1a' },
                            ]}
                          >
                            {cell.day}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <View style={styles.legendRow}>
                  {INTENSITY_LABELS.map((label, i) => (
                    <View key={label} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: INTENSITY_COLORS[i] }]} />
                      <Text style={styles.legendText}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.landscapeCard}>
                <View style={styles.intensityHeader}>
                  <View style={styles.landscapeCardTitleRow}>
                    <Ionicons name="pulse-outline" size={16} color="#1a1a1a" />
                    <Text style={styles.landscapeCardTitle}>INTENSITY GRAPH</Text>
                  </View>
                  {/* OVER LIMIT / HEALTHY DAY pill removed */}
                </View>

                <Text style={styles.intensitySub}>Minutes spent in distraction apps</Text>

                <View
                  style={[
                    styles.barChart,
                    { height: LANDSCAPE_CHART_H, overflow: 'hidden' },
                  ]}
                >
                  {weeklyData.map((d) => (
                    <View key={d.day} style={styles.barCol}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: barPixelHeight(d.value, LANDSCAPE_CHART_H),
                            backgroundColor: d.value > scrollLimit ? '#C94C4C' : '#A8A29E',
                          },
                        ]}
                      />
                      <Text style={styles.barLabel}>{d.day}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <Pressable
                style={styles.previousLosses}
                onPress={() => router.push('/(tabs)/graveyard')}
              >
                <View style={styles.previousLossesLeft}>
                  <Ionicons name="skull-outline" size={20} color="#999" />
                  <Text style={styles.previousLossesText}>
                    PREVIOUS LOSSES: {graveyardCount} PET{graveyardCount === 1 ? '' : 'S'}
                  </Text>
                </View>
                <Text style={styles.previousLossesLink}>VIEW GRAVEYARD ›</Text>
              </Pressable>
            </ScrollView>

            {/* RIGHT — header + 4 cards */}
            <View style={{ width: cardsColumnWidth, flexGrow: 0, flexShrink: 0, gap: 12 }}>
              <View style={styles.landscapeHeader}>
                <Text style={styles.landscapeHeaderTitle}>LOGS & STATS</Text>
                <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
                  <Image
                    source={SETTINGS_ICON}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                  />
                </Pressable>
              </View>

              <View style={styles.landscapeStatsGrid}>
                {statCards.map((item) => (
                  <View key={item.label} style={styles.landscapeStatCard}>
                    <View style={styles.landscapeStatLabelRow}>
                      <Ionicons name={item.icon as any} size={14} color="#999" />
                      <Text style={styles.landscapeStatLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.landscapeStatValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== PORTRAIT ====================
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
      <View style={{ flex: 1, backgroundColor: '#FFF9F5' }}>
        <ScrollView contentContainerStyle={styles.portraitScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.portraitHeader}>
            <Text style={styles.portraitHeaderTitle}>LOGS & STATS</Text>
            <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
              <Image
                source={SETTINGS_ICON}
                style={{ width: 22, height: 22 }}
                contentFit="contain"
              />
            </Pressable>
          </View>

          <View style={styles.portraitCard}>
            <View style={styles.portraitCardHeader}>
              <View style={styles.portraitCardTitleRow}>
                <Ionicons name="calendar-outline" size={17} color="#1a1a1a" />
                <Text style={styles.portraitCardTitle}>ACTIVITY</Text>
              </View>
              <View style={styles.portraitMonthRow}>
                <Text style={styles.portraitMonthText}>{month}</Text>
              </View>
            </View>

            <View style={styles.dayHeaders}>
              {DAYS.map((d, i) => (
                <View key={i} style={styles.dayHeaderCell}>
                  <Text style={styles.portraitDayHeaderText}>{d}</Text>
                </View>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {activity.map((cell, i) => (
                <View key={i} style={styles.portraitCalendarCell}>
                  {cell.day === null ? (
                    <View
                      style={[
                        styles.portraitCalendarCellInner,
                        { backgroundColor: 'transparent', borderColor: 'transparent' },
                      ]}
                    />
                  ) : (
                    <View
                      style={[
                        styles.portraitCalendarCellInner,
                        {
                          backgroundColor: INTENSITY_COLORS[cell.level],
                          borderColor: cell.level === 0 ? '#f0e6e0' : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.portraitCalendarDayText,
                          { color: cell.level >= 3 ? '#fff' : '#1a1a1a' },
                        ]}
                      >
                        {cell.day}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.portraitLegendRow}>
              {INTENSITY_LABELS.map((label, i) => (
                <View key={label} style={styles.portraitLegendItem}>
                  <View
                    style={[styles.portraitLegendDot, { backgroundColor: INTENSITY_COLORS[i] }]}
                  />
                  <Text style={styles.portraitLegendText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.portraitStatsGrid}>
            {statCards.map((item) => (
              <View key={item.label} style={styles.portraitStatCard}>
                <View style={styles.portraitStatLabelRow}>
                  <Ionicons name={item.icon as any} size={15} color="#999" />
                  <Text style={styles.portraitStatLabel}>{item.label}</Text>
                </View>
                <Text style={styles.portraitStatValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.portraitCard}>
            <View style={styles.portraitIntensityHeader}>
              <View style={styles.portraitCardTitleRow}>
                <Ionicons name="pulse-outline" size={17} color="#1a1a1a" />
                <Text style={styles.portraitCardTitle}>INTENSITY GRAPH</Text>
              </View>
              {/* OVER LIMIT / HEALTHY DAY pill removed */}
            </View>

            <Text style={styles.portraitIntensitySub}>Minutes spent in distraction apps</Text>

            <View
              style={[
                styles.portraitBarChart,
                { height: PORTRAIT_CHART_H, overflow: 'hidden' },
              ]}
            >
              {weeklyData.map((d) => (
                <View key={d.day} style={styles.barCol}>
                  <View
                    style={[
                      styles.portraitBarFill,
                      {
                        height: barPixelHeight(d.value, PORTRAIT_CHART_H),
                        backgroundColor: d.value > scrollLimit ? '#C94C4C' : '#A8A29E',
                      },
                    ]}
                  />
                  <Text style={styles.portraitBarLabel}>{d.day}</Text>
                </View>
              ))}
            </View>
          </View>

          <Pressable
            style={styles.previousLosses}
            onPress={() => router.push('/(tabs)/graveyard')}
          >
            <View style={styles.previousLossesLeft}>
              <Ionicons name="skull-outline" size={20} color="#999" />
              <Text style={styles.previousLossesText}>
                PREVIOUS LOSSES: {graveyardCount} PET{graveyardCount === 1 ? '' : 'S'}
              </Text>
            </View>
            <Text style={styles.previousLossesLink}>VIEW GRAVEYARD ›</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const menuStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  card: {
    position: 'absolute',
    top: 56,
    backgroundColor: '#FFF9F5',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    minWidth: 160,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  itemTextDanger: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B83F3F',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0e6e0',
  },
});
