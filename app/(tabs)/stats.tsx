import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import {
  checkAndRequestUsagePermission,
  getPetScrollMinutes,
  getTopEnemyApp,
} from '@/services/usage';
import { styles } from '@/styles/stats.styles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const INTENSITY_COLORS = ['#E8E4DF', '#F5D76E', '#F0A05A', '#E06B6B', '#C94C4C'];
const INTENSITY_LABELS = ['CLEAN', 'MILD', 'ALERT', 'HIGH', 'CRITICAL'];

function getIntensityLevel(minutes: number, limit: number): number {
  if (minutes <= 0) return 0;
  const ratio = minutes / limit;
  if (ratio < 0.5) return 1;
  if (ratio < 0.9) return 2;
  if (ratio < 1.3) return 3;
  return 4;
}

export default function StatsScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [scrollLimit, setScrollLimit] = useState(45);
  const [graveyardCount, setGraveyardCount] = useState(0);
  const [health, setHealth] = useState(100);
  const [topEnemy, setTopEnemy] = useState('—');
  const [streak, setStreak] = useState(0);
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

  const loadStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Graveyard count
      const graveSnap = await getDocs(collection(db, 'users', user.uid, 'graveyard'));
      setGraveyardCount(graveSnap.size);

      // Current pet + usage
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const pet = userDoc.exists() ? userDoc.data()?.pet : null;

      let minutes = 0;
      let limit = 45;
      let hp = 100;

      if (pet) {
        limit = pet.scrollLimit ?? 45;
        hp = pet.health ?? 100;

        const granted = await checkAndRequestUsagePermission();
        if (granted) {
          const result = await getPetScrollMinutes(
            pet.usageBaselineMinutes ?? 0,
            pet.usageBaselineDate ?? ''
          );
          minutes = result.minutes;

          const enemy = await getTopEnemyApp();
          setTopEnemy(enemy);
        } else {
          minutes = pet.totalScrollToday ?? 0;
          setTopEnemy('—');
        }
      }

      setTodayMinutes(minutes);
      setScrollLimit(limit);
      setHealth(hp);

      // Simple streak for now
      setStreak(minutes <= limit ? 1 : 0);

      // Put today's real value into the correct day of the week
      const dayIndex = new Date().getDay(); // 0 = Sun
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      setWeeklyData((prev) =>
        prev.map((d) =>
          d.day === dayNames[dayIndex] ? { ...d, value: minutes } : d
        )
      );
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

  const maxBar = Math.max(45, ...weeklyData.map((d) => d.value), 1);
  const intensity = getIntensityLevel(todayMinutes, scrollLimit);
  const isHealthyWeek = todayMinutes <= scrollLimit;

  const today = new Date().getDate();
  const activity = Array.from({ length: 31 }, (_, i) => {
    if (i + 1 === today) return intensity;
    return 0;
  });

  const statCards = [
    { label: 'DAILY AVG', value: `${todayMinutes}m`, icon: 'time-outline' },
    { label: 'WEEKLY', value: '—', icon: 'trending-down' },
    { label: 'TOP ENEMY', value: topEnemy, icon: 'phone-portrait-outline' },
    { label: 'STREAK', value: `${streak}D`, icon: 'flash-outline' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#B83F3F" />
        </View>
      </SafeAreaView>
    );
  }

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.landscapeRow}>
          <View style={styles.landscapeLeft}>
            <View style={styles.landscapeHeader}>
              <Text style={styles.landscapeHeaderTitle}>LOGS & STATS</Text>
              <Ionicons name="notifications-outline" size={20} color="#1a1a1a" />
            </View>

            <View style={styles.landscapeLevelCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.landscapeLevelTitle}>LEVEL 12</Text>
                <Text style={styles.landscapeLevelSub}>Doom-Resistant Warrior</Text>
                <View style={styles.landscapePillsRow}>
                  <View style={styles.streakPillLandscape}>
                    <Text style={styles.streakPillTextLandscape}>
                      TODAY: {todayMinutes}m
                    </Text>
                  </View>
                  <View style={styles.hpPillLandscape}>
                    <Text style={styles.hpPillTextLandscape}>HP: {health}%</Text>
                  </View>
                </View>
              </View>
              <View style={styles.landscapeImageBox}>
                <Ionicons name="image-outline" size={24} color="#C4B5A8" />
              </View>
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

          <ScrollView
            style={styles.landscapeRightScroll}
            contentContainerStyle={styles.landscapeRightContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.landscapeCard}>
              <View style={styles.landscapeCardHeader}>
                <View style={styles.landscapeCardTitleRow}>
                  <Ionicons name="calendar-outline" size={16} color="#1a1a1a" />
                  <Text style={styles.landscapeCardTitle}>ACTIVITY MATRIX</Text>
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
                {activity.map((level, i) => (
                  <View key={i} style={styles.calendarCell}>
                    <View
                      style={[
                        styles.calendarCellInner,
                        {
                          backgroundColor: INTENSITY_COLORS[level],
                          borderColor: level === 0 ? '#f0e6e0' : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          { color: level >= 3 ? '#fff' : '#1a1a1a' },
                        ]}
                      >
                        {i + 1}
                      </Text>
                    </View>
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
                <View style={styles.healthyPill}>
                  <Text style={styles.healthyPillText}>
                    {isHealthyWeek ? 'HEALTHY DAY' : 'OVER LIMIT'}
                  </Text>
                </View>
              </View>

              <Text style={styles.intensitySub}>Minutes spent in distraction apps</Text>

              <View style={styles.barChart}>
                {weeklyData.map((d) => (
                  <View key={d.day} style={styles.barCol}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${(d.value / maxBar) * 100}%`,
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
        </View>
      </SafeAreaView>
    );
  }

  // ==================== PORTRAIT ====================
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.portraitScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.portraitHeader}>
          <Text style={styles.portraitHeaderTitle}>LOGS & STATS</Text>
          <Ionicons name="notifications-outline" size={22} color="#1a1a1a" />
        </View>

        <View style={styles.portraitLevelCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.portraitLevelTitle}>LEVEL 12</Text>
            <Text style={styles.portraitLevelSub}>Doom-Resistant Warrior</Text>
            <View style={styles.portraitPillsRow}>
              <View style={styles.streakPill}>
                <Text style={styles.streakPillText}>TODAY: {todayMinutes}m</Text>
              </View>
              <View style={styles.hpPill}>
                <Text style={styles.hpPillText}>HP: {health}%</Text>
              </View>
            </View>
          </View>
          <View style={styles.portraitImageBox}>
            <Ionicons name="image-outline" size={28} color="#C4B5A8" />
          </View>
        </View>

        <View style={styles.portraitCard}>
          <View style={styles.portraitCardHeader}>
            <View style={styles.portraitCardTitleRow}>
              <Ionicons name="calendar-outline" size={17} color="#1a1a1a" />
              <Text style={styles.portraitCardTitle}>ACTIVITY MATRIX</Text>
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
            {activity.map((level, i) => (
              <View key={i} style={styles.portraitCalendarCell}>
                <View
                  style={[
                    styles.portraitCalendarCellInner,
                    {
                      backgroundColor: INTENSITY_COLORS[level],
                      borderColor: level === 0 ? '#f0e6e0' : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.portraitCalendarDayText,
                      { color: level >= 3 ? '#fff' : '#1a1a1a' },
                    ]}
                  >
                    {i + 1}
                  </Text>
                </View>
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
            <View style={styles.portraitHealthyPill}>
              <Text style={styles.portraitHealthyPillText}>
                {isHealthyWeek ? 'HEALTHY DAY' : 'OVER LIMIT'}
              </Text>
            </View>
          </View>

          <Text style={styles.portraitIntensitySub}>Minutes spent in distraction apps</Text>

          <View style={styles.portraitBarChart}>
            {weeklyData.map((d) => (
              <View key={d.day} style={styles.barCol}>
                <View
                  style={[
                    styles.portraitBarFill,
                    {
                      height: `${(d.value / maxBar) * 100}%`,
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
    </SafeAreaView>
  );
}