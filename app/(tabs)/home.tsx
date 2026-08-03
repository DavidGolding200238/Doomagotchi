import { styles } from '@/styles/home.styles';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PET_IMAGE = require('@/assets/images/duckpet.gif');

function getVitality(health: number, happiness: number) {
  const avg = (health + happiness) / 2;
  if (avg >= 80) return { label: 'OPTIMAL', color: '#22c55e' };
  if (avg >= 60) return { label: 'GOOD', color: '#84cc16' };
  if (avg >= 40) return { label: 'TIRED', color: '#eab308' };
  if (avg >= 20) return { label: 'SICK', color: '#f97316' };
  return { label: 'CRITICAL', color: '#ef4444' };
}

export default function HomeScreen() {
  const [health, setHealth] = useState(88);
  const [happiness, setHappiness] = useState(94);
  const [scrollMinutes, setScrollMinutes] = useState(12);

  const petName = 'McHammer';
  const level = 12;
  const scrollLimit = 45;

  const vitality = getVitality(health, happiness);
  const isHealthy = scrollMinutes <= scrollLimit;

  const powerUps = [
    { id: '1', title: 'No Instagram for 4 hours', xp: 50, tag: 'ENERGY REGEN' },
    { id: '2', title: 'Read 10 pages of a book', xp: 30, tag: 'ENERGY REGEN' },
    { id: '3', title: 'Morning digital detox (1hr)', xp: 40, tag: 'ENERGY REGEN' },
  ];

  const badges = [
    { id: '1', emoji: '☀️', name: 'Sun Gazer' },
    { id: '2', emoji: '👑', name: 'Focus King' },
    { id: '3', emoji: '🌙', name: 'Deep Sleeper' },
    { id: '4', emoji: '📖', name: 'Bookworm' },
  ];

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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            LVL {level} • {petName.toUpperCase()}
          </Text>
          <Pressable style={styles.bellBtn} hitSlop={12}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </Pressable>
        </View>

        {/* Pet card */}
        <View style={styles.petCard}>
          <View style={[styles.vitalityBadge, { backgroundColor: vitality.color + '22' }]}>
            <Text style={[styles.vitalityText, { color: vitality.color }]}>
              VITALITY: {vitality.label}
            </Text>
          </View>
          <View style={styles.petImageWrap}>
            <Image source={PET_IMAGE} style={styles.petImage} contentFit="contain" />
          </View>
        </View>

        {/* Health + Happiness */}
        <View style={styles.barsRow}>
          <View style={styles.barBlock}>
            <View style={styles.barLabelRow}>
              <Text style={{ fontSize: 14 }}>❤️</Text>
              <Text style={styles.barLabel}>HEALTH</Text>
              <Text style={styles.barValue}>{health}%</Text>
            </View>
            <View style={styles.barTrack}>
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
              <Text style={styles.barLabel}>HAPPINESS</Text>
              <Text style={styles.barValue}>{happiness}%</Text>
            </View>
            <View style={styles.barTrack}>
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
          <Text style={styles.sectionTitle}>FOCUS ANALYSIS</Text>
          <Pressable onPress={toggleDemoState}>
            <Text style={styles.demoToggle}>TOGGLE STATE (DEMO)</Text>
          </Pressable>
        </View>

        <View style={styles.focusCard}>
          <View style={styles.focusLeft}>
            <Text style={{ fontSize: 18 }}>⏱️</Text>
            <View>
              <Text style={styles.focusLabel}>TODAY'S SCROLL</Text>
              <Text style={styles.focusValue}>{scrollMinutes}m</Text>
            </View>
          </View>
          <View style={styles.focusRight}>
            <View style={[styles.statusPill, { backgroundColor: isHealthy ? '#dcfce7' : '#fee2e2' }]}>
              <Text style={{ color: isHealthy ? '#16a34a' : '#dc2626', fontWeight: '800', fontSize: 12 }}>
                {isHealthy ? '↑ HEALTHY' : '↓ OVER LIMIT'}
              </Text>
            </View>
            <Text style={styles.limitText}>LIMIT: {scrollLimit}M</Text>
          </View>
        </View>

        {/* Power Ups */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ POWER UP {petName.toUpperCase()}</Text>
        </View>

        <View style={styles.powerList}>
          {powerUps.map((item) => (
            <Pressable key={item.id} style={styles.powerCard}>
              <View style={styles.powerLeft}>
                <View style={styles.powerIcon}>
                  <Text style={{ fontSize: 16 }}>⚡</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.powerTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.powerMeta}>+{item.xp} XP • {item.tag}</Text>
                </View>
              </View>
              <Text style={{ color: '#ccc', fontSize: 18 }}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Badges */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT BADGES</Text>
        </View>

        <View style={styles.badgesRow}>
          {badges.map((b) => (
            <View key={b.id} style={styles.badgeCard}>
              <Text style={{ fontSize: 26 }}>{b.emoji}</Text>
              <Text style={styles.badgeName} numberOfLines={1}>{b.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}