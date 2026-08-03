import { Image } from 'expo-image';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

// TODO: Replace with assets/images/duckpet.gif once the McHammer GIF is added
const PET_PLACEHOLDER = require('@/assets/images/icon.png');

type Mood = 'optimal' | 'good' | 'tired' | 'sick' | 'critical';

function getVitality(health: number, happiness: number): { label: string; color: string } {
  const avg = (health + happiness) / 2;
  if (avg >= 80) return { label: 'OPTIMAL', color: '#22c55e' };
  if (avg >= 60) return { label: 'GOOD', color: '#84cc16' };
  if (avg >= 40) return { label: 'TIRED', color: '#eab308' };
  if (avg >= 20) return { label: 'SICK', color: '#f97316' };
  return { label: 'CRITICAL', color: '#ef4444' };
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  // Demo state — later driven by UsageStats + Firestore
  const [health, setHealth] = useState(88);
  const [happiness, setHappiness] = useState(94);
  const [scrollMinutes, setScrollMinutes] = useState(12);
  const petName = 'Kippo';
  const level = 12;
  const scrollLimit = 45;

  const vitality = getVitality(health, happiness);
  const isHealthy = scrollMinutes <= scrollLimit;

  const powerUps = [
    { id: '1', title: 'No Instagram for 4 hours', xp: 50, tag: 'ENERGY REGEN', done: false },
    { id: '2', title: 'Read 10 pages of a book', xp: 30, tag: 'ENERGY REGEN', done: false },
    { id: '3', title: 'Morning digital detox (1hr)', xp: 40, tag: 'ENERGY REGEN', done: false },
  ];

  const badges = [
    { id: '1', emoji: '☀️', name: 'Sun Gazer' },
    { id: '2', emoji: '👑', name: 'Focus King' },
    { id: '3', emoji: '🌙', name: 'Deep Sleeper' },
    { id: '4', emoji: '📖', name: 'Bookworm' },
  ];

  // Demo toggles to preview sick/healthy states
  const toggleDemoState = () => {
    if (health > 50) {
      setHealth(28);
      setHappiness(35);
      setScrollMinutes(68);
    } else {
      setHealth(88);
      setHappiness(94);
      setScrollMinutes(12);
    }
  };

  const bg = isDark ? '#0f0f0f' : '#ffffff';
  const cardBg = isDark ? '#1c1c1e' : '#f8f8f8';
  const textPrimary = isDark ? '#f5f5f5' : '#111111';
  const textSecondary = isDark ? '#a1a1aa' : '#6b7280';
  const border = isDark ? '#2c2c2e' : '#e5e7eb';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>
            LVL {level} • {petName.toUpperCase()}
          </Text>
          <Pressable style={styles.bellBtn} hitSlop={12}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </Pressable>
        </View>

        {/* Pet hero card */}
        <View style={[styles.petCard, { backgroundColor: cardBg, borderColor: border }]}>
          <View style={[styles.vitalityBadge, { backgroundColor: vitality.color + '22' }]}>
            <Text style={[styles.vitalityText, { color: vitality.color }]}>
              VITALITY: {vitality.label}
            </Text>
          </View>

          <View style={styles.petImageWrap}>
            {/* Swap this Image for duckpet.gif when available */}
            <Image
              source={PET_PLACEHOLDER}
              style={styles.petImage}
              contentFit="contain"
            />
            {/* Fallback emoji if you prefer pure pixel feel for now */}
            {/* <Text style={{ fontSize: 120 }}>🦆</Text> */}
          </View>
        </View>

        {/* Health + Happiness bars */}
        <View style={styles.barsRow}>
          <View style={styles.barBlock}>
            <View style={styles.barLabelRow}>
              <Text style={{ fontSize: 14 }}>❤️</Text>
              <Text style={[styles.barLabel, { color: textSecondary }]}>HEALTH</Text>
              <Text style={[styles.barValue, { color: textPrimary }]}>{health}%</Text>
            </View>
            <View style={[styles.barTrack, { backgroundColor: border }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${health}%`,
                    backgroundColor: health >= 60 ? '#22c55e' : health >= 30 ? '#eab308' : '#ef4444',
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.barBlock}>
            <View style={styles.barLabelRow}>
              <Text style={{ fontSize: 14 }}>😊</Text>
              <Text style={[styles.barLabel, { color: textSecondary }]}>HAPPINESS</Text>
              <Text style={[styles.barValue, { color: textPrimary }]}>{happiness}%</Text>
            </View>
            <View style={[styles.barTrack, { backgroundColor: border }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${happiness}%`,
                    backgroundColor: happiness >= 60 ? '#3b82f6' : happiness >= 30 ? '#eab308' : '#ef4444',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Focus Analysis */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>FOCUS ANALYSIS</Text>
          <Pressable onPress={toggleDemoState}>
            <Text style={[styles.demoToggle, { color: textSecondary }]}>TOGGLE STATE (DEMO)</Text>
          </Pressable>
        </View>

        <View style={[styles.focusCard, { backgroundColor: cardBg, borderColor: border }]}>
          <View style={styles.focusLeft}>
            <Text style={{ fontSize: 18 }}>⏱️</Text>
            <View>
              <Text style={[styles.focusLabel, { color: textSecondary }]}>TODAY'S SCROLL</Text>
              <Text style={[styles.focusValue, { color: textPrimary }]}>{scrollMinutes}m</Text>
            </View>
          </View>
          <View style={styles.focusRight}>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: isHealthy ? '#dcfce7' : '#fee2e2' },
              ]}>
              <Text
                style={{
                  color: isHealthy ? '#16a34a' : '#dc2626',
                  fontWeight: '700',
                  fontSize: 12,
                }}>
                {isHealthy ? '↑ HEALTHY' : '↓ OVER LIMIT'}
              </Text>
            </View>
            <Text style={[styles.limitText, { color: textSecondary }]}>LIMIT: {scrollLimit}M</Text>
          </View>
        </View>

        {/* Power Ups */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>⚡ POWER UP {petName.toUpperCase()}</Text>
        </View>

        <View style={styles.powerList}>
          {powerUps.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.powerCard, { backgroundColor: cardBg, borderColor: border }]}
              onPress={() => {
                // later: complete challenge → heal pet + XP
              }}>
              <View style={styles.powerLeft}>
                <View style={[styles.powerIcon, { backgroundColor: isDark ? '#2c2c2e' : '#e5e7eb' }]}>
                  <Text style={{ fontSize: 16 }}>⚡</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.powerTitle, { color: textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.powerMeta, { color: textSecondary }]}>
                    +{item.xp} XP • {item.tag}
                  </Text>
                </View>
              </View>
              <Text style={{ color: textSecondary, fontSize: 18 }}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent Badges */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>RECENT BADGES</Text>
        </View>

        <View style={styles.badgesRow}>
          {badges.map((b) => (
            <View
              key={b.id}
              style={[styles.badgeCard, { backgroundColor: cardBg, borderColor: border }]}>
              <Text style={{ fontSize: 28 }}>{b.emoji}</Text>
              <Text style={[styles.badgeName, { color: textSecondary }]} numberOfLines={1}>
                {b.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  vitalityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vitalityText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  petImageWrap: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  petImage: {
    width: 160,
    height: 160,
  },
  barsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  barBlock: {
    flex: 1,
  },
  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    flex: 1,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  demoToggle: {
    fontSize: 11,
    fontWeight: '600',
  },
  focusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  focusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  focusValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  focusRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  limitText: {
    fontSize: 11,
    fontWeight: '600',
  },
  powerList: {
    gap: 10,
    marginBottom: 24,
  },
  powerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  powerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  powerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  powerMeta: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
