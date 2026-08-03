import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const FALLEN = [
  { name: 'Sparky', days: 14, cause: 'TIKTOK OVERDOSE', date: 'Oct 12, 2023' },
  { name: 'Bloop', days: 5, cause: 'REELS ADDICTION', date: 'Nov 05, 2023' },
  { name: 'Robo-X', days: 22, cause: 'TWITTER DOOM-SCROLLING', date: 'Dec 20, 2023' },
  { name: 'Flame', days: 2, cause: 'LATE NIGHT SCROLLING', date: 'Jan 15, 2024' },
];

export default function GraveyardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bg = isDark ? '#0f0f0f' : '#f3f4f6';
  const textPrimary = isDark ? '#f5f5f5' : '#111111';
  const textSecondary = isDark ? '#a1a1aa' : '#6b7280';
  const cardBg = isDark ? '#1c1c1e' : '#ffffff';
  const border = isDark ? '#2c2c2e' : '#e5e7eb';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textPrimary }]}>Eternal Resting Place</Text>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </View>

        <View style={styles.hero}>
          <Text style={{ fontSize: 36 }}>💀</Text>
          <Text style={[styles.heroTitle, { color: textPrimary }]}>The Fallen Friends</Text>
          <Text style={[styles.heroQuote, { color: textSecondary }]}>
            "Every scroll cost a soul. Remember those who suffered from the doom."
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: cardBg, borderColor: border }]}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>TOTAL SOULS</Text>
            <Text style={[styles.statNum, { color: textPrimary }]}>4</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: cardBg, borderColor: border }]}>
            <Text style={[styles.statLabel, { color: textSecondary }]}>BEST STREAK</Text>
            <Text style={[styles.statNum, { color: textPrimary }]}>22d</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {FALLEN.map((pet) => (
            <View
              key={pet.name}
              style={[styles.petCard, { backgroundColor: cardBg, borderColor: border }]}>
              <View style={[styles.petPlaceholder, { backgroundColor: isDark ? '#2c2c2e' : '#e5e7eb' }]}>
                <Text style={{ fontSize: 28, opacity: 0.4 }}>🪦</Text>
              </View>
              <Text style={[styles.petName, { color: textPrimary }]}>{pet.name}</Text>
              <Text style={[styles.petDays, { color: textSecondary }]}>LIVED  {pet.days} DAYS</Text>
              <View style={[styles.causePill, { borderColor: border }]}>
                <Text style={[styles.causeText, { color: textSecondary }]}>{pet.cause}</Text>
              </View>
              <Text style={[styles.petDate, { color: textSecondary }]}>📅 {pet.date}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.lesson, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.lessonTitle, { color: textPrimary }]}>A Lesson from the Past</Text>
          <Text style={{ color: textSecondary, marginTop: 6, lineHeight: 20 }}>
            Most pets here passed between 2 AM and 4 AM. Charge your phone in another room tonight.
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
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  hero: { alignItems: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  heroQuote: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  statLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.4 },
  statNum: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  petCard: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  petPlaceholder: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  petName: { fontSize: 16, fontWeight: '800' },
  petDays: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  causePill: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  causeText: { fontSize: 9, fontWeight: '700' },
  petDate: { fontSize: 10, marginTop: 8 },
  lesson: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  lessonTitle: { fontSize: 14, fontWeight: '700' },
});
