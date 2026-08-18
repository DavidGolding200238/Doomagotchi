import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/stats.styles';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const ACTIVITY = [
  0, 1, 0, 2, 0, 0, 1,
  0, 1, 2, 0, 0, 1, 0,
  0, 0, 1, 0, 2, 0, 0,
  0, 0, 0, 0, 3, 0, 1,
  0, 0, 0,
];

const INTENSITY_COLORS = ['#E8E4DF', '#F5D76E', '#F0A05A', '#E06B6B', '#C94C4C'];
const INTENSITY_LABELS = ['CLEAN', 'MILD', 'ALERT', 'HIGH', 'CRITICAL'];

const WEEKLY_DATA = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 120 },
  { day: 'Wed', value: 35 },
  { day: 'Thu', value: 95 },
  { day: 'Fri', value: 210 },
  { day: 'Sat', value: 20 },
  { day: 'Sun', value: 65 },
];

export default function StatsScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [month] = useState('OCT 2024');
  const maxBar = Math.max(...WEEKLY_DATA.map((d) => d.value));

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.landscapeRow}>
          {/* LEFT */}
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
                    <Text style={styles.streakPillTextLandscape}>STREAK: 5D</Text>
                  </View>
                  <View style={styles.hpPillLandscape}>
                    <Text style={styles.hpPillTextLandscape}>HP: 85%</Text>
                  </View>
                </View>
              </View>
              <View style={styles.landscapeImageBox}>
                <Ionicons name="image-outline" size={24} color="#C4B5A8" />
              </View>
            </View>

            <View style={styles.landscapeStatsGrid}>
              {[
                { label: 'DAILY AVG', value: '42m', icon: 'time-outline' },
                { label: 'WEEKLY', value: '-12%', icon: 'trending-down' },
                { label: 'TOP ENEMY', value: 'X (Twitter)', icon: 'phone-portrait-outline' },
                { label: 'WILLPOWER', value: 'S-RANK', icon: 'flash-outline' },
              ].map((item) => (
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

          {/* RIGHT */}
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
                  <Ionicons name="chevron-back" size={16} color="#999" />
                  <Text style={styles.landscapeMonthText}>{month}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
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
                {ACTIVITY.map((level, i) => (
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
                  <Text style={styles.healthyPillText}>HEALTHY WEEK</Text>
                </View>
              </View>

              <Text style={styles.intensitySub}>Minutes spent in distraction apps</Text>

              <View style={styles.barChart}>
                {WEEKLY_DATA.map((d) => (
                  <View key={d.day} style={styles.barCol}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${(d.value / maxBar) * 100}%`,
                          backgroundColor: d.value > 150 ? '#C94C4C' : '#A8A29E',
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>{d.day}</Text>
                  </View>
                ))}
              </View>
            </View>
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
                <Text style={styles.streakPillText}>STREAK: 5D</Text>
              </View>
              <View style={styles.hpPill}>
                <Text style={styles.hpPillText}>HP: 85%</Text>
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
              <Ionicons name="chevron-back" size={18} color="#999" />
              <Text style={styles.portraitMonthText}>{month}</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
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
            {ACTIVITY.map((level, i) => (
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
                <View style={[styles.portraitLegendDot, { backgroundColor: INTENSITY_COLORS[i] }]} />
                <Text style={styles.portraitLegendText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.portraitStatsGrid}>
          {[
            { label: 'DAILY AVG', value: '42m', icon: 'time-outline' },
            { label: 'WEEKLY', value: '-12%', icon: 'trending-down' },
            { label: 'TOP ENEMY', value: 'X (Twitter)', icon: 'phone-portrait-outline' },
            { label: 'WILLPOWER', value: 'S-RANK', icon: 'flash-outline' },
          ].map((item) => (
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
              <Text style={styles.portraitHealthyPillText}>HEALTHY WEEK</Text>
            </View>
          </View>

          <Text style={styles.portraitIntensitySub}>Minutes spent in distraction apps</Text>

          <View style={styles.portraitBarChart}>
            {WEEKLY_DATA.map((d) => (
              <View key={d.day} style={styles.barCol}>
                <View
                  style={[
                    styles.portraitBarFill,
                    {
                      height: `${(d.value / maxBar) * 100}%`,
                      backgroundColor: d.value > 150 ? '#C94C4C' : '#A8A29E',
                    },
                  ]}
                />
                <Text style={styles.portraitBarLabel}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.portraitCard}>
          <View style={styles.criticalRow}>
            <View style={styles.criticalIcon}>
              <Ionicons name="warning-outline" size={22} color="#FF6B6B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.criticalTitle}>CRITICAL EVENT: FRIDAY</Text>
              <Text style={styles.criticalBody}>
                You scrolled for 210m. Your Pet "Blip" suffered -15 HP.
              </Text>
            </View>
          </View>

          <Pressable style={styles.restoreBtn}>
            <Text style={styles.restoreBtnText}>RESTORE WILLPOWER</Text>
          </Pressable>
        </View>

        <Pressable style={styles.previousLosses}>
          <View style={styles.previousLossesLeft}>
            <Ionicons name="skull-outline" size={20} color="#999" />
            <Text style={styles.previousLossesText}>PREVIOUS LOSSES: 3 PETS</Text>
          </View>
          <Text style={styles.previousLossesLink}>VIEW GRAVEYARD ›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}