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

function PixelBar({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <View
      style={{
        height: 14,
        backgroundColor: '#1a1a1a',
        padding: 2,
        borderRadius: 6,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#2a2a2a',
          overflow: 'hidden',
          borderRadius: 6,
        }}
      >
        <View
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: color,
          }}
        />
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

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9F5' }} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 14, gap: 14 }}>
          {/* LEFT — Pet Showcase */}
          <View
            style={{
              width: '38%',
              backgroundColor: '#FFF0EB',
              borderRadius: 28,
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.09,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 11,
                color: '#1a1a1a',
                marginBottom: 14,
                opacity: 0.85,
              }}
            >
              LVL {level}
            </Text>

            <View
              style={{
                width: 176,
                height: 176,
                borderRadius: 88,
                backgroundColor: '#FFF7F2',
                borderWidth: 3,
                borderColor: '#E8B923',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.13,
                shadowRadius: 18,
                elevation: 9,
              }}
            >
              <Image
                source={PET_IMAGE}
                style={{ width: '86%', height: '86%' }}
                contentFit="contain"
              />
            </View>

            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 13,
                color: '#1a1a1a',
                marginTop: 16,
              }}
            >
              {petName}
            </Text>
          </View>

          {/* RIGHT — White Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 28,
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 18,
              elevation: 10,
              overflow: 'hidden',
            }}
          >
            <ScrollView
              contentContainerStyle={{ padding: 18, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Health + Happiness */}
              <View style={{ flexDirection: 'row', gap: 14, marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#777', letterSpacing: 0.3 }}>HEALTH</Text>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a' }}>{health}%</Text>
                  </View>
                  <PixelBar value={health} color={getHealthColor(health)} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#777', letterSpacing: 0.3 }}>HAPPINESS</Text>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a' }}>{happiness}%</Text>
                  </View>
                  <PixelBar value={happiness} color={getHappinessColor(happiness)} />
                </View>
              </View>

              {/* Focus */}
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a', marginBottom: 10, letterSpacing: 0.4 }}>
                TODAY'S FOCUS
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 14,
                  borderRadius: 18,
                  backgroundColor: isHealthy ? '#F0FDF4' : '#FFF1F2',
                  borderWidth: 1.5,
                  borderColor: isHealthy ? '#E2F5E9' : '#FDE8E8',
                  marginBottom: 22,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#777' }}>SCROLL TIME</Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: '#1a1a1a' }}>{scrollMinutes}m</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 9,
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
                      {isHealthy ? 'LOOKING GOOD' : 'TOO MUCH'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#999' }}>
                    LIMIT {scrollLimit}M
                  </Text>
                </View>
              </View>

              {/* Power Ups */}
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a', marginBottom: 12, letterSpacing: 0.4 }}>
                HELP {petName.toUpperCase()}
              </Text>

              <View style={{ gap: 9, marginBottom: 22 }}>
                {powerUps.map((item) => (
                  <Pressable
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 13,
                      paddingHorizontal: 14,
                      borderRadius: 16,
                      backgroundColor: '#FFF7F2',
                      borderWidth: 1.5,
                      borderColor: '#f0e6e0',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.06,
                      shadowRadius: 7,
                      elevation: 3,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 11,
                          backgroundColor: '#E8B923',
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 3,
                          elevation: 2,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>XP</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#1a1a1a' }} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#999', marginTop: 2 }}>
                          +{item.xp} XP • {item.tag}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: '#C4B5A8', fontSize: 17 }}>›</Text>
                  </Pressable>
                ))}
              </View>

              {/* Badges */}
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a', marginBottom: 12, letterSpacing: 0.4 }}>
                LATEST BADGES
              </Text>

              <View style={{ flexDirection: 'row', gap: 9 }}>
                {badges.map((b) => (
                  <View
                    key={b.id}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 13,
                      borderRadius: 18,
                      backgroundColor: '#FFF7F2',
                      borderWidth: 1.5,
                      borderColor: '#F0E6E0',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.09,
                      shadowRadius: 8,
                      elevation: 4,
                      gap: 7,
                    }}
                  >
                    <BadgeIcon size={34} type={b.type} />
                    <Text
                      style={{ fontSize: 9.5, fontWeight: '700', color: '#555', textAlign: 'center' }}
                      numberOfLines={1}
                    >
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#B83F3F' }} edges={['top']}>
      <View style={{ flex: 1 }}>
        {/* Hero */}
        <View
          style={{
            paddingTop: 8,
            paddingBottom: 28,
            alignItems: 'center',
            backgroundColor: '#FFF0EB',
          }}
        >
          <View
            style={{
              width: '100%',
              paddingHorizontal: 22,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 12,
                color: '#1a1a1a',
                opacity: 0.9,
              }}
            >
              LVL {level}
            </Text>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#FF6B6B',
                opacity: 0.7,
              }}
            />
          </View>

          <View
            style={{
              width: 232,
              height: 232,
              borderRadius: 116,
              backgroundColor: '#FFF7F2',
              borderWidth: 3.5,
              borderColor: '#FFC300',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: 0.14,
              shadowRadius: 22,
              elevation: 12,
            }}
          >
            <Image
              source={PET_IMAGE}
              style={{ width: '85%', height: '85%' }}
              contentFit="contain"
            />
          </View>

          <Text
            style={{
              fontFamily: 'PressStart2P_400Regular',
              fontSize: 17,
              color: '#1a1a1a',
              marginTop: 18,
            }}
          >
            {petName}
          </Text>
        </View>

        {/* White bottom card - always reaches the bottom */}
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            marginTop: -22,
            borderWidth: 1.5,
            borderColor: '#d4c8be',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 16,
            overflow: 'hidden',
          }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 22,
              paddingTop: 28,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Health + Happiness */}
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 26 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#777', letterSpacing: 0.3 }}>HEALTH</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#1a1a1a' }}>{health}%</Text>
                </View>
                <PixelBar value={health} color={getHealthColor(health)} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#777', letterSpacing: 0.3 }}>HAPPINESS</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#1a1a1a' }}>{happiness}%</Text>
                </View>
                <PixelBar value={happiness} color={getHappinessColor(happiness)} />
              </View>
            </View>

            {/* Focus */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '800',
                color: '#1a1a1a',
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              TODAY'S FOCUS
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 17,
                borderRadius: 20,
                backgroundColor: isHealthy ? '#F0FDF4' : '#FFF1F2',
                borderWidth: 1.5,
                borderColor: isHealthy ? '#E2F5E9' : '#FDE8E8',
                marginBottom: 28,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.07,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <View>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#777' }}>SCROLL TIME</Text>
                <Text style={{ fontSize: 26, fontWeight: '900', color: '#1a1a1a', marginTop: 2 }}>
                  {scrollMinutes}m
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 5 }}>
                <View
                  style={{
                    paddingHorizontal: 11,
                    paddingVertical: 6,
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
                    {isHealthy ? 'LOOKING GOOD' : 'TOO MUCH'}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#999' }}>
                  LIMIT {scrollLimit}M
                </Text>
              </View>
            </View>

            {/* Power Ups */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '800',
                color: '#1a1a1a',
                letterSpacing: 0.5,
                marginBottom: 14,
              }}
            >
              HELP {petName.toUpperCase()}
            </Text>

            <View style={{ gap: 11, marginBottom: 28 }}>
              {powerUps.map((item) => (
                <Pressable
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    borderRadius: 18,
                    backgroundColor: '#FFF7F2',
                    borderWidth: 1.5,
                    borderColor: '#f0e6e0',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.07,
                    shadowRadius: 9,
                    elevation: 4,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, flex: 1 }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 13,
                        backgroundColor: '#E8B923',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.12,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>XP</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14.5, fontWeight: '700', color: '#1a1a1a' }} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 11.5, fontWeight: '600', color: '#999', marginTop: 2 }}>
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
              LATEST BADGES
            </Text>

            <View style={{ flexDirection: 'row', gap: 11 }}>
              {badges.map((b) => (
                <View
                  key={b.id}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 6,
                    borderRadius: 22,
                    backgroundColor: '#FFF7F2',
                    borderWidth: 1.5,
                    borderColor: '#F0E6E0',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                    gap: 8,
                  }}
                >
                  <BadgeIcon size={42} type={b.type} />
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
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}