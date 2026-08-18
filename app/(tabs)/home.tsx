import { BadgeIcon } from '@/components/BadgeIcon';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import { styles } from '@/styles/home.styles';
import { Image } from 'expo-image';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PET_IMAGE = require('@/assets/images/duckpet.gif');

type PetData = {
  id: string;
  type: string;
  name: string;
  title: string;
  createdAt: string;
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

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { user } = useAuth();

  const [pet, setPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);

  const [health] = useState(88);
  const [happiness] = useState(94);
  const [scrollMinutes] = useState(12);
  const level = 12;
  const scrollLimit = 45;
  const isHealthy = scrollMinutes <= scrollLimit;

  const powerUps = [
    { id: '1', title: 'No Instagram for 4 hours', xp: 50, tag: 'ENERGY REGEN' },
    { id: '2', title: 'Read 10 pages of a book', xp: 30, tag: 'ENERGY REGEN' },
    { id: '3', title: 'Morning digital detox (1hr)', xp: 40, tag: 'ENERGY REGEN' },
  ];

  const badges = [
    { id: '1', name: 'Sun Gazer', type: 'sun' as const },
    { id: '2', name: 'Focus King', type: 'focus' as const },
    { id: '3', name: 'Deep Sleeper', type: 'sleep' as const },
    { id: '4', name: 'Bookworm', type: 'book' as const },
  ];

  useEffect(() => {
    async function loadPet() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data()?.pet) {
          setPet(userDoc.data().pet as PetData);
        }
      } catch (error) {
        console.log('Error loading pet:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPet();
  }, [user]);

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

  if (loading) {
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
        <View style={styles.landscapeRow}>
          <View style={styles.landscapePetCard}>
            <Text style={styles.landscapeLevel}>LVL {level}</Text>

            <View style={styles.landscapePetCircle}>
              <Image source={PET_IMAGE} style={{ width: '86%', height: '86%' }} contentFit="contain" />
            </View>

            <Text style={styles.landscapePetName}>{petName}</Text>
          </View>

          <View style={styles.landscapeWhiteCard}>
            <ScrollView contentContainerStyle={styles.landscapeScrollContent} showsVerticalScrollIndicator={false}>
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

              <Text style={styles.sectionTitleLandscape}>HELP {petName.toUpperCase()}</Text>

              <View style={styles.powerListLandscape}>
                {powerUps.map((item) => (
                  <Pressable key={item.id} style={styles.powerCardLandscape}>
                    <View style={styles.powerLeftLandscape}>
                      <View style={styles.powerIconLandscape}>
                        <Text style={styles.powerXpLandscape}>XP</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.powerTitleLandscape} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.powerMetaLandscape}>
                          +{item.xp} XP • {item.tag}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.powerChevronLandscape}>›</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.sectionTitleLandscape}>LATEST BADGES</Text>

              <View style={styles.badgesRowLandscape}>
                {badges.map((b) => (
                  <View key={b.id} style={styles.badgeCardLandscape}>
                    <BadgeIcon size={34} type={b.type} />
                    <Text style={styles.badgeNameLandscape} numberOfLines={1}>
                      {b.name}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== PORTRAIT ====================
  return (
    <SafeAreaView style={styles.portraitSafe} edges={['top']}>
      <View style={{ flex: 1 }}>
        <View style={styles.portraitHero}>
          <View style={styles.portraitHeaderRow}>
            <Text style={styles.portraitLevel}>LVL {level}</Text>
            <View style={styles.portraitDot} />
          </View>

          <View style={styles.portraitPetCircle}>
            <Image source={PET_IMAGE} style={{ width: '85%', height: '85%' }} contentFit="contain" />
          </View>

          <Text style={styles.portraitPetName}>{petName}</Text>
        </View>

        <View style={styles.portraitWhiteCard}>
          <ScrollView contentContainerStyle={styles.portraitScrollContent} showsVerticalScrollIndicator={false}>
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
                  <Text
                    style={[
                      styles.statusText,
                      { color: isHealthy ? '#16a34a' : '#dc2626' },
                    ]}
                  >
                    {isHealthy ? 'LOOKING GOOD' : 'TOO MUCH'}
                  </Text>
                </View>
                <Text style={styles.limitText}>LIMIT {scrollLimit}M</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>HELP {petName.toUpperCase()}</Text>

            <View style={styles.powerList}>
              {powerUps.map((item) => (
                <Pressable key={item.id} style={styles.powerCard}>
                  <View style={styles.powerLeft}>
                    <View style={styles.powerIcon}>
                      <Text style={styles.powerXp}>XP</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.powerTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.powerMeta}>
                        +{item.xp} XP • {item.tag}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.powerChevron}>›</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>LATEST BADGES</Text>

            <View style={styles.badgesRow}>
              {badges.map((b) => (
                <View key={b.id} style={styles.badgeCard}>
                  <BadgeIcon size={42} type={b.type} />
                  <Text style={styles.badgeName} numberOfLines={1}>
                    {b.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}