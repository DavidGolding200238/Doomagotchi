import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bg = isDark ? '#0f0f0f' : '#ffffff';
  const textPrimary = isDark ? '#f5f5f5' : '#111111';
  const textSecondary = isDark ? '#a1a1aa' : '#6b7280';
  const cardBg = isDark ? '#1c1c1e' : '#f8f8f8';
  const border = isDark ? '#2c2c2e' : '#e5e7eb';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textPrimary }]}>LOGS & STATS</Text>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </View>

        {/* Level card */}
        <View style={[styles.levelCard, { backgroundColor: cardBg, borderColor: border }]}>
          <View>
            <Text style={[styles.levelTitle, { color: textPrimary }]}>LEVEL 12</Text>
            <Text style={[styles.levelSub, { color: textSecondary }]}>Doom-Resistant Warrior</Text>
            <View style={styles.pills}>
              <View style={[styles.pill, { borderColor: border }]}>
                <Text style={[styles.pillText, { color: textSecondary }]}>STREAK: 5D</Text>
              </View>
              <View style={[styles.pill, { borderColor: border }]}>
                <Text style={[styles.pillText, { color: textSecondary }]}>HP: 85%</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={[styles.section, { color: textPrimary }]}>📅 ACTIVITY MATRIX</Text>
        <View style={[styles.placeholder, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={{ color: textSecondary, textAlign: 'center' }}>
            Calendar heatmap coming next.\n(Matches Visily Logs & Stats wireframe)
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: border }]}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>DAILY AVG</Text>
            <Text style={[styles.statValue, { color: textPrimary }]}>42m</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: border }]}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>WEEKLY ↓</Text>
            <Text style={[styles.statValue, { color: '#16a34a' }]}>-12%</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: border }]}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>TOP ENEMY</Text>
            <Text style={[styles.statValue, { color: textPrimary }]}>X (Twitter)</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: border }]}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>WILLPOWER</Text>
            <Text style={[styles.statValue, { color: textPrimary }]}>S-RANK</Text>
          </View>
        </View>

        <Text style={[styles.section, { color: textPrimary }]}>📈 INTENSITY GRAPH</Text>
        <View style={[styles.placeholder, { backgroundColor: cardBg, borderColor: border, height: 160 }]}>
          <Text style={{ color: textSecondary }}>Bar chart placeholder</Text>
        </View>

        <View style={[styles.criticalCard, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.criticalTitle, { color: textPrimary }]}>CRITICAL EVENT: FRIDAY</Text>
          <Text style={{ color: textSecondary, marginTop: 4 }}>
            You scrolled for 210m. Your Pet "Kippo" suffered -15 HP.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  levelCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  levelTitle: { fontSize: 20, fontWeight: '800' },
  levelSub: { fontSize: 13, marginTop: 2 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 12 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  pillText: { fontSize: 11, fontWeight: '700' },
  section: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  placeholder: {
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 16,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  statLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
  statValue: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  criticalCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
  criticalTitle: { fontSize: 13, fontWeight: '700' },
});
