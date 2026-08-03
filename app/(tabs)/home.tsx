import { BadgeIcon } from '@/components/BadgeIcon';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PET_IMAGE = require('@/assets/images/duckpet.gif');

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [health, setHealth] = useState(88);
  const [happiness, setHappiness] = useState(94);
  const [scrollMinutes, setScrollMinutes] = useState(12);

  const petName = 'McHammer';
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

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9F5' }} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 14, gap: 14 }}>
          
          {/* LEFT — Pet Showcase */}
          <View
            style={{
              width: '40%',
              backgroundColor: '#FFF0EB',
              borderRadius: 22,
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 16,
            }}
          >
            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 11,
                color: '#1a1a1a',
                marginBottom: 12,
              }}
            >
              LVL {level}
            </Text>

            <View
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: '#FFF7F2',
                borderWidth: 3,
                borderColor: '#E8B923',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Image
                source={PET_IMAGE}
                style={{ width: '84%', height: '84%' }}
                contentFit="contain"
              />
            </View>

            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 14,
                color: '#1a1a1a',
                marginTop: 14,
              }}
            >
              {petName}
            </Text>
          </View>

          {/* RIGHT — Content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Health + Happiness */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#777' }}>HEALTH</Text>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a' }}>{health}%</Text>
                </View>
                <View style={{ height: 9, borderRadius: 5, backgroundColor: '#f0e6e0', overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${health}%`,
                      borderRadius: 5,
                      backgroundColor: health >= 60 ? '#22c55e' : health >= 30 ? '#eab308' : '#ef4444',
                    }}
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#777' }}>HAPPINESS</Text>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a' }}>{happiness}%</Text>
                </View>
                <View style={{ height: 9, borderRadius: 5, backgroundColor: '#f0e6e0', overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${happiness}%`,
                      borderRadius: 5,
                      backgroundColor: happiness >= 60 ? '#3b82f6' : happiness >= 30 ? '#eab308' : '#ef4444',
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Focus */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a' }}>FOCUS ANALYSIS</Text>
              <Pressable onPress={toggleDemoState}>
                <Text style={{ fontSize: 10, fontWeight: '600', color: '#999' }}>TOGGLE</Text>
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                borderRadius: 14,
                backgroundColor: isHealthy ? '#F0FDF4' : '#FFF1F2',
                borderWidth: 1.5,
                borderColor: isHealthy ? '#BBF7D0' : '#FECDD3',
                marginBottom: 18,
              }}
            >
              <View>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#777' }}>TODAY'S SCROLL</Text>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#1a1a1a' }}>{scrollMinutes}m</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 3 }}>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor: isHealthy ? '#DCFCE7' : '#FEE2E2',
                  }}
                >
                  <Text
                    style={{
                      color: isHealthy ? '#16a34a' : '#dc2626',
                      fontWeight: '800',
                      fontSize: 11,
                    }}
                  >
                    {isHealthy ? 'HEALTHY' : 'OVER LIMIT'}
                  </Text>
                </View>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#999' }}>
                  LIMIT: {scrollLimit}M
                </Text>
              </View>
            </View>

            {/* Power Ups */}
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a', marginBottom: 10 }}>
              POWER UP {petName.toUpperCase()}
            </Text>

            <View style={{ gap: 8, marginBottom: 18 }}>
              {powerUps.map((item) => (
                <Pressable
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 12,
                    borderRadius: 14,
                    backgroundColor: '#FFF7F2',
                    borderWidth: 1.5,
                    borderColor: '#f0e6e0',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        backgroundColor: '#E8B923',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>XP</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a1a1a' }} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 10, fontWeight: '600', color: '#999', marginTop: 1 }}>
                        +{item.xp} XP • {item.tag}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: '#C4B5A8', fontSize: 16 }}>›</Text>
                </Pressable>
              ))}
            </View>

            {/* Badges */}
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a', marginBottom: 10 }}>
              RECENT BADGES
            </Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              {badges.map((b) => (
                <View
                  key={b.id}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderRadius: 20,
                    backgroundColor: '#FFF7F2',
                    borderWidth: 1.5,
                    borderColor: '#F0E6E0',
                    shadowColor: '#E8B923',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 4,
                    gap: 6,
                  }}
                >
                  <BadgeIcon size={34} type={b.type} />
                  <Text
                    style={{ fontSize: 9, fontWeight: '700', color: '#555', textAlign: 'center' }}
                    numberOfLines={1}
                  >
                    {b.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== PORTRAIT ====================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9F5' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View
          style={{
            paddingTop: 12,
            paddingBottom: 20,
            alignItems: 'center',
            backgroundColor: '#FFF0EB',
          }}
        >
          <View
            style={{
              width: '100%',
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 13,
                color: '#1a1a1a',
              }}
            >
              LVL {level}
            </Text>
            <Pressable hitSlop={12}>
              <Text style={{ fontSize: 18, color: '#FF6B6B' }}>•</Text>
            </Pressable>
          </View>

          <View
            style={{
              width: 220,
              height: 220,
              borderRadius: 110,
              backgroundColor: '#FFF7F2',
              borderWidth: 3,
              borderColor: '#FFC300',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.12,
              shadowRadius: 18,
              elevation: 10,
            }}
          >
            <Image
              source={PET_IMAGE}
              style={{ width: '84%', height: '84%' }}
              contentFit="contain"
            />
          </View>

          <Text
            style={{
              fontFamily: 'PressStart2P_400Regular',
              fontSize: 18,
              color: '#1a1a1a',
              marginTop: 16,
            }}
          >
            {petName}
          </Text>
        </View>

        {/* Bottom Card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            marginTop: -16,
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 20,
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
          }}
        >
          {/* Health + Happiness */}
          <View style={{ flexDirection: 'row', gap: 14, marginBottom: 24 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#777' }}>HEALTH</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a' }}>{health}%</Text>
              </View>
              <View style={{ height: 10, borderRadius: 6, backgroundColor: '#f0e6e0', overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%',
                    width: `${health}%`,
                    borderRadius: 6,
                    backgroundColor: health >= 60 ? '#22c55e' : health >= 30 ? '#eab308' : '#ef4444',
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#777' }}>HAPPINESS</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a' }}>{happiness}%</Text>
              </View>
              <View style={{ height: 10, borderRadius: 6, backgroundColor: '#f0e6e0', overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%',
                    width: `${happiness}%`,
                    borderRadius: 6,
                    backgroundColor: happiness >= 60 ? '#3b82f6' : happiness >= 30 ? '#eab308' : '#ef4444',
                  }}
                />
              </View>
            </View>
          </View>

          {/* Focus */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a', letterSpacing: 0.5 }}>
              FOCUS ANALYSIS
            </Text>
            <Pressable onPress={toggleDemoState}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#999' }}>TOGGLE STATE</Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              borderRadius: 18,
              backgroundColor: isHealthy ? '#F0FDF4' : '#FFF1F2',
              borderWidth: 1.5,
              borderColor: isHealthy ? '#BBF7D0' : '#FECDD3',
              marginBottom: 24,
            }}
          >
            <View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#777' }}>TODAY'S SCROLL</Text>
              <Text style={{ fontSize: 24, fontWeight: '900', color: '#1a1a1a' }}>{scrollMinutes}m</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  backgroundColor: isHealthy ? '#DCFCE7' : '#FEE2E2',
                }}
              >
                <Text
                  style={{
                    color: isHealthy ? '#16a34a' : '#dc2626',
                    fontWeight: '800',
                    fontSize: 12,
                  }}
                >
                  {isHealthy ? 'HEALTHY' : 'OVER LIMIT'}
                </Text>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#999' }}>
                LIMIT: {scrollLimit}M
              </Text>
            </View>
          </View>

          {/* Power Ups */}
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a', letterSpacing: 0.5, marginBottom: 12 }}>
            POWER UP {petName.toUpperCase()}
          </Text>

          <View style={{ gap: 10, marginBottom: 24 }}>
            {powerUps.map((item) => (
              <Pressable
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  borderRadius: 16,
                  backgroundColor: '#FFF7F2',
                  borderWidth: 1.5,
                  borderColor: '#f0e6e0',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: '#E8B923',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>XP</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a' }} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#999', marginTop: 2 }}>
                      +{item.xp} XP • {item.tag}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#C4B5A8', fontSize: 18 }}>›</Text>
              </Pressable>
            ))}
          </View>

          {/* Badges */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: '800',
              color: '#1a1a1a',
              letterSpacing: 0.5,
              marginBottom: 14,
            }}
          >
            RECENT BADGES
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {badges.map((b) => (
              <View
                key={b.id}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 6,
                  borderRadius: 24,
                  backgroundColor: '#FFF7F2',
                  borderWidth: 1.5,
                  borderColor: '#F0E6E0',
                  shadowColor: '#E8B923',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  elevation: 5,
                  gap: 8,
                }}
              >
                <BadgeIcon size={44} type={b.type} />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: '#555',
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {b.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}