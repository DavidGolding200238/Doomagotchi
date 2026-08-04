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

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Mock intensity for each day of the month (0 = clean, 4 = critical)
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9F5' }} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 14, gap: 14 }}>
          {/* LEFT COLUMN */}
          <View style={{ width: '42%', gap: 12 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'PressStart2P_400Regular', fontSize: 11, color: '#1a1a1a' }}>
                LOGS & STATS
              </Text>
              <Ionicons name="notifications-outline" size={20} color="#1a1a1a" />
            </View>

            {/* Level Card */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: '#f0e6e0',
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PressStart2P_400Regular', fontSize: 13, color: '#1a1a1a' }}>
                  LEVEL 12
                </Text>
                <Text style={{ fontSize: 12, color: '#777', marginTop: 4 }}>Doom-Resistant Warrior</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <View style={{ backgroundColor: '#FFF0EB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#FF6B6B' }}>STREAK: 5D</Text>
                  </View>
                  <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#16a34a' }}>HP: 85%</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: '#FFF7F2',
                  borderWidth: 1.5,
                  borderColor: '#f0e6e0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="image-outline" size={24} color="#C4B5A8" />
              </View>
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: 'DAILY AVG', value: '42m', icon: 'time-outline' },
                { label: 'WEEKLY', value: '-12%', icon: 'trending-down' },
                { label: 'TOP ENEMY', value: 'X (Twitter)', icon: 'phone-portrait-outline' },
                { label: 'WILLPOWER', value: 'S-RANK', icon: 'flash-outline' },
              ].map((item) => (
                <View
                  key={item.label}
                  style={{
                    width: '47%',
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    borderWidth: 1.5,
                    borderColor: '#f0e6e0',
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Ionicons name={item.icon as any} size={14} color="#999" />
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#999' }}>{item.label}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a1a1a' }}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* RIGHT COLUMN */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Activity Matrix */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: '#f0e6e0',
                padding: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="calendar-outline" size={16} color="#1a1a1a" />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a' }}>ACTIVITY MATRIX</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="chevron-back" size={16} color="#999" />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#1a1a1a' }}>{month}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </View>
              </View>

              {/* Day headers */}
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                {DAYS.map((d, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#999' }}>{d}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {ACTIVITY.map((level, i) => (
                  <View
                    key={i}
                    style={{
                      width: `${100 / 7}%`,
                      aspectRatio: 1,
                      padding: 2,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 6,
                        backgroundColor: INTENSITY_COLORS[level],
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: level === 0 ? '#f0e6e0' : 'transparent',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '600', color: level >= 3 ? '#fff' : '#1a1a1a' }}>
                        {i + 1}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Legend */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                {INTENSITY_LABELS.map((label, i) => (
                  <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: INTENSITY_COLORS[i] }} />
                    <Text style={{ fontSize: 9, fontWeight: '600', color: '#777' }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Intensity Graph */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: '#f0e6e0',
                padding: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="pulse-outline" size={16} color="#1a1a1a" />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a1a1a' }}>INTENSITY GRAPH</Text>
                </View>
                <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#16a34a' }}>HEALTHY WEEK</Text>
                </View>
              </View>

              <Text style={{ fontSize: 11, color: '#999', marginBottom: 10 }}>Minutes spent in distraction apps</Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 6 }}>
                {WEEKLY_DATA.map((d) => (
                  <View key={d.day} style={{ flex: 1, alignItems: 'center' }}>
                    <View
                      style={{
                        width: '80%',
                        height: `${(d.value / maxBar) * 100}%`,
                        backgroundColor: d.value > 150 ? '#C94C4C' : '#A8A29E',
                        borderRadius: 6,
                        minHeight: 6,
                      }}
                    />
                    <Text style={{ fontSize: 10, fontWeight: '600', color: '#777', marginTop: 6 }}>{d.day}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9F5' }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <Text style={{ fontFamily: 'PressStart2P_400Regular', fontSize: 13, color: '#1a1a1a' }}>
            LOGS & STATS
          </Text>
          <Ionicons name="notifications-outline" size={22} color="#1a1a1a" />
        </View>

        {/* Level Card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 22,
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            marginBottom: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.09,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'PressStart2P_400Regular', fontSize: 14, color: '#1a1a1a' }}>
              LEVEL 12
            </Text>
            <Text style={{ fontSize: 13, color: '#777', marginTop: 4 }}>Doom-Resistant Warrior</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <View style={{ backgroundColor: '#FFF0EB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#FF6B6B' }}>STREAK: 5D</Text>
              </View>
              <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#16a34a' }}>HP: 85%</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: '#FFF7F2',
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="image-outline" size={28} color="#C4B5A8" />
          </View>
        </View>

        {/* Activity Matrix */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 22,
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
            padding: 16,
            marginBottom: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.09,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="calendar-outline" size={17} color="#1a1a1a" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a' }}>ACTIVITY MATRIX</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="chevron-back" size={18} color="#999" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a1a1a' }}>{month}</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </View>
          </View>

          {/* Day headers */}
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            {DAYS.map((d, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#999' }}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {ACTIVITY.map((level, i) => (
              <View
                key={i}
                style={{
                  width: `${100 / 7}%`,
                  aspectRatio: 1,
                  padding: 3,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderRadius: 8,
                    backgroundColor: INTENSITY_COLORS[level],
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: level === 0 ? '#f0e6e0' : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: level >= 3 ? '#fff' : '#1a1a1a' }}>
                    {i + 1}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap', gap: 6 }}>
            {INTENSITY_LABELS.map((label, i) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 11, height: 11, borderRadius: 3, backgroundColor: INTENSITY_COLORS[i] }} />
                <Text style={{ fontSize: 10, fontWeight: '600', color: '#777' }}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Grid 2x2 */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11, marginBottom: 18 }}>
          {[
            { label: 'DAILY AVG', value: '42m', icon: 'time-outline' },
            { label: 'WEEKLY', value: '-12%', icon: 'trending-down' },
            { label: 'TOP ENEMY', value: 'X (Twitter)', icon: 'phone-portrait-outline' },
            { label: 'WILLPOWER', value: 'S-RANK', icon: 'flash-outline' },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                width: '47.5%',
                backgroundColor: '#fff',
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: '#f0e6e0',
                padding: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.07,
                shadowRadius: 9,
                elevation: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Ionicons name={item.icon as any} size={15} color="#999" />
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#999' }}>{item.label}</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a' }}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Intensity Graph */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 22,
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
            padding: 16,
            marginBottom: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.09,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="pulse-outline" size={17} color="#1a1a1a" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a' }}>INTENSITY GRAPH</Text>
            </View>
            <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#16a34a' }}>HEALTHY WEEK</Text>
            </View>
          </View>

          <Text style={{ fontSize: 12, color: '#999', marginBottom: 14 }}>Minutes spent in distraction apps</Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: 8 }}>
            {WEEKLY_DATA.map((d) => (
              <View key={d.day} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={{
                    width: '75%',
                    height: `${(d.value / maxBar) * 100}%`,
                    backgroundColor: d.value > 150 ? '#C94C4C' : '#A8A29E',
                    borderRadius: 7,
                    minHeight: 8,
                  }}
                />
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#777', marginTop: 8 }}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Critical Event */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 22,
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
            padding: 16,
            marginBottom: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.09,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: '#FFF0EB',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="warning-outline" size={22} color="#FF6B6B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 }}>
                CRITICAL EVENT: FRIDAY
              </Text>
              <Text style={{ fontSize: 13, color: '#666', lineHeight: 19 }}>
                You scrolled for 210m. Your Pet "Blip" suffered -15 HP.
              </Text>
            </View>
          </View>

          <Pressable
            style={{
              backgroundColor: '#FF6B6B',
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: 'center',
              shadowColor: '#FF6B6B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>RESTORE WILLPOWER</Text>
          </Pressable>
        </View>

        {/* Previous Losses */}
        <Pressable
          style={{
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
            borderStyle: 'dashed',
            borderRadius: 18,
            paddingVertical: 16,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFF7F2',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="skull-outline" size={20} color="#999" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#555' }}>
              PREVIOUS LOSSES: 3 PETS
            </Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#FF6B6B' }}>VIEW GRAVEYARD ›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}