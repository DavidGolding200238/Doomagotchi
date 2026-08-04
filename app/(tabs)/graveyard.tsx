import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PET_IMAGE = require('@/assets/images/duckpet.gif');

const FALLEN = [
  {
    id: '1',
    name: 'Sparky',
    days: 14,
    cause: 'TIKTOK OVERDOSE',
    date: 'Oct 12, 2023',
    epitaph: 'Here lies Sparky.\nHe swore “just one more video”\nwouldn’t kill him.',
  },
  {
    id: '2',
    name: 'Bloop',
    days: 5,
    cause: 'REELS ADDICTION',
    date: 'Nov 05, 2023',
    epitaph: 'Here lies Bloop.\nHis last words were\n“this one is actually funny though”.',
  },
  {
    id: '3',
    name: 'Robo-X',
    days: 22,
    cause: 'TWITTER DOOM-SCROLLING',
    date: 'Dec 20, 2023',
    epitaph: 'Here lies Robo-X.\nHe went looking for discourse\nand found eternal rest instead.',
  },
  {
    id: '4',
    name: 'Flame',
    days: 2,
    cause: 'LATE NIGHT SCROLLING',
    date: 'Jan 15, 2024',
    epitaph: 'Here lies Flame.\nDied doing what he loved:\nscrolling at 3:47 AM.',
  },
];

export default function GraveyardScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [selectedPet, setSelectedPet] = useState<(typeof FALLEN)[0] | null>(null);

  const GravestoneModal = () => {
    if (!selectedPet) return null;

    return (
      <Modal visible={!!selectedPet} transparent animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.82)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 28,
          }}
          onPress={() => setSelectedPet(null)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: 300,
              backgroundColor: '#2A1F1C',
              borderTopLeftRadius: 80,
              borderTopRightRadius: 80,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              borderWidth: 2.5,
              borderColor: '#5A4038',
              paddingTop: 36,
              paddingBottom: 28,
              paddingHorizontal: 24,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <View
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                backgroundColor: '#1A1210',
                borderWidth: 3,
                borderColor: '#B83F3F',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18,
                overflow: 'hidden',
              }}
            >
              <Image
                source={PET_IMAGE}
                style={{ width: '82%', height: '82%', opacity: 0.78 }}
                contentFit="contain"
              />
            </View>

            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 15,
                color: '#F5E6D3',
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              {selectedPet.name}
            </Text>

            <Text style={{ fontSize: 13, color: '#8A7F76', marginBottom: 14 }}>
              Lived {selectedPet.days} days
            </Text>

            <View
              style={{
                backgroundColor: '#3D1F1C',
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#E07A6A' }}>
                {selectedPet.cause}
              </Text>
            </View>

            <View
              style={{
                borderTopWidth: 1.5,
                borderBottomWidth: 1.5,
                borderColor: '#3D2E2A',
                paddingVertical: 16,
                width: '100%',
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: '#E8D5C4',
                  textAlign: 'center',
                  lineHeight: 23,
                  fontStyle: 'italic',
                }}
              >
                {selectedPet.epitaph}
              </Text>
            </View>

            <Text style={{ fontSize: 13, color: '#6B6560', marginBottom: 22 }}>
              {selectedPet.date}
            </Text>

            <Pressable
              onPress={() => setSelectedPet(null)}
              style={{
                backgroundColor: '#B83F3F',
                paddingHorizontal: 28,
                paddingVertical: 12,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#B83F3F' }} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1, backgroundColor: '#1A1210', flexDirection: 'row', padding: 14, gap: 16 }}>
          {/* LEFT */}
          <View style={{ width: '34%', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: '#B83F3F',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#B83F3F',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <Ionicons name="skull" size={36} color="#FFF" />
            </View>

            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 12,
                color: '#F5E6D3',
                textAlign: 'center',
                lineHeight: 18,
              }}
            >
              Eternal Resting{'\n'}Place
            </Text>

            <Text style={{ fontSize: 13, color: '#A89F93', textAlign: 'center', lineHeight: 18 }}>
              Every scroll cost a soul.
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#8A7F76' }}>SOULS</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: '#F5E6D3' }}>4</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#3D2E2A' }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#8A7F76' }}>BEST</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: '#F5E6D3' }}>22d</Text>
              </View>
            </View>
          </View>

          {/* RIGHT */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {FALLEN.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPet(pet)}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#2A1F1C',
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: '#3D2E2A',
                  padding: 14,
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <View
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 46,
                    backgroundColor: '#1A1210',
                    borderWidth: 3,
                    borderColor: '#5A4038',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={PET_IMAGE}
                    style={{ width: '84%', height: '84%', opacity: 0.72 }}
                    contentFit="contain"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'PressStart2P_400Regular', fontSize: 14, color: '#E8D5C4' }}>
                    {pet.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#8A7F76', marginTop: 4 }}>
                    Lived {pet.days} days
                  </Text>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: '#3D1F1C',
                      paddingHorizontal: 9,
                      paddingVertical: 4,
                      borderRadius: 8,
                      marginTop: 7,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#E07A6A' }}>{pet.cause}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#6B6560', marginTop: 7 }}>{pet.date}</Text>
                </View>
              </Pressable>
            ))}

            <View
              style={{
                borderWidth: 1.5,
                borderColor: '#B83F3F',
                borderStyle: 'dashed',
                borderRadius: 18,
                padding: 18,
                alignItems: 'center',
                backgroundColor: '#2A1F1C',
              }}
            >
              <Text style={{ fontSize: 13, color: '#E07A6A', textAlign: 'center', fontWeight: '600' }}>
                This plot is reserved for your current pet
              </Text>
            </View>
          </ScrollView>
        </View>

        <GravestoneModal />
      </SafeAreaView>
    );
  }

  // ==================== PORTRAIT ====================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#B83F3F' }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: '#1A1210' }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Dramatic combined header */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: 22,
                backgroundColor: '#B83F3F',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                shadowColor: '#B83F3F',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.45,
                shadowRadius: 18,
                elevation: 12,
              }}
            >
              <Ionicons name="skull" size={38} color="#FFF" />
            </View>

            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 16,
                color: '#F5E6D3',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Eternal Resting Place
            </Text>

            <Text style={{ fontSize: 14, color: '#A89F93', textAlign: 'center', lineHeight: 20 }}>
              Every scroll cost a soul.{'\n'}
              Remember those who suffered.
            </Text>
          </View>

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#2A1F1C',
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: '#3D2E2A',
              marginBottom: 24,
              overflow: 'hidden',
            }}
          >
            <View style={{ flex: 1, paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#8A7F76' }}>TOTAL SOULS</Text>
              <Text style={{ fontSize: 26, fontWeight: '900', color: '#F5E6D3', marginTop: 2 }}>4</Text>
            </View>
            <View style={{ width: 1, backgroundColor: '#3D2E2A' }} />
            <View style={{ flex: 1, paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#8A7F76' }}>BEST STREAK</Text>
              <Text style={{ fontSize: 26, fontWeight: '900', color: '#F5E6D3', marginTop: 2 }}>22d</Text>
            </View>
          </View>

          {/* Memorial cards */}
          <View style={{ gap: 16, marginBottom: 20 }}>
            {FALLEN.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPet(pet)}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#2A1F1C',
                  borderRadius: 22,
                  borderWidth: 1.5,
                  borderColor: '#3D2E2A',
                  padding: 16,
                  alignItems: 'center',
                  gap: 18,
                }}
              >
                <View
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                    backgroundColor: '#1A1210',
                    borderWidth: 3,
                    borderColor: '#5A4038',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={PET_IMAGE}
                    style={{ width: '85%', height: '85%', opacity: 0.75 }}
                    contentFit="contain"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'PressStart2P_400Regular',
                      fontSize: 15,
                      color: '#E8D5C4',
                    }}
                  >
                    {pet.name}
                  </Text>

                  <Text style={{ fontSize: 15, color: '#8A7F76', marginTop: 6 }}>
                    Lived {pet.days} days
                  </Text>

                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: '#3D1F1C',
                      paddingHorizontal: 11,
                      paddingVertical: 5,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#E07A6A' }}>{pet.cause}</Text>
                  </View>

                  <Text style={{ fontSize: 13, color: '#6B6560', marginTop: 10 }}>{pet.date}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Reserved plot */}
          <View
            style={{
              borderWidth: 1.5,
              borderColor: '#B83F3F',
              borderStyle: 'dashed',
              borderRadius: 18,
              paddingVertical: 24,
              paddingHorizontal: 16,
              alignItems: 'center',
              backgroundColor: '#2A1F1C',
              marginBottom: 20,
            }}
          >
            <Ionicons name="alert-circle-outline" size={26} color="#B83F3F" style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 14, color: '#E07A6A', textAlign: 'center', fontWeight: '600', lineHeight: 20 }}>
              This plot is reserved{'\n'}for your current pet
            </Text>
          </View>

          {/* Lesson */}
          <View
            style={{
              backgroundColor: '#2A1F1C',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1.5,
              borderColor: '#3D2E2A',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons name="moon-outline" size={16} color="#E8D5C4" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#E8D5C4' }}>A Lesson from the Past</Text>
            </View>
            <Text style={{ fontSize: 13, color: '#A89F93', lineHeight: 19, marginBottom: 10 }}>
              Most of them died between 2 AM and 4 AM. Charge your phone in another room tonight.
            </Text>
            <Pressable>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#E07A6A' }}>Set Sleep Habits →</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <GravestoneModal />
    </SafeAreaView>
  );
}