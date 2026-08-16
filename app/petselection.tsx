import { auth, db } from '@/services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PETS = [
  {
    id: '1',
    name: 'Nugget',
    title: 'THE SOFT ONE',
    description: 'Tiny, round, and emotionally fragile. Dies a little every time you open TikTok.',
  },
  {
    id: '2',
    name: 'Waddles',
    title: 'THE HAPPY DUCK',
    description: 'Has one brain cell and it’s trusting you with it. Don’t open Instagram.',
  },
  {
    id: '3',
    name: 'Bloop',
    title: 'THE HOPEFUL ONE',
    description: 'Pure of heart, empty of thoughts. Will stare at you in silent betrayal if you scroll at 2am.',
  },
];

export default function PetSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [activeIndex, setActiveIndex] = useState(0);
  const [petName, setPetName] = useState('McHammer');
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const buttonGlow = useSharedValue(0);
  const cinematicScale = useSharedValue(1);
  const cinematicOpacity = useSharedValue(0);

  const currentPet = PETS[activeIndex];

  const changePet = (direction: 'next' | 'prev') => {
    opacity.value = withTiming(0, { duration: 100 });
    scale.value = withTiming(0.9, { duration: 100 });

    setTimeout(() => {
      setActiveIndex((prev) => {
        if (direction === 'next') return (prev + 1) % PETS.length;
        return (prev - 1 + PETS.length) % PETS.length;
      });

      translateX.value = 0;
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withSpring(1);
    }, 110);
  };

  const startJourney = async () => {
    if (!auth.currentUser) {
      Alert.alert('Not logged in', 'Please log in again.');
      return;
    }

    try {
      setIsSaving(true);

      // Cinematic pulse
      cinematicScale.value = withSequence(
        withTiming(1.25, { duration: 300 }),
        withTiming(1, { duration: 400 })
      );
      cinematicOpacity.value = withSequence(
        withTiming(0.7, { duration: 200 }),
        withTiming(0, { duration: 600 })
      );

      // Save pet to Firestore
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          pet: {
            id: currentPet.id,
            type: currentPet.name,
            name: petName.trim() || currentPet.name,
            title: currentPet.title,
            createdAt: new Date().toISOString(),
          },
        },
        { merge: true }
      );

      // Small delay so the cinematic feels good
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 900);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not save your pet');
      setIsSaving(false);
    }
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setIsDragging)(true);
    })
    .onUpdate((e) => {
      const isHorizontal = Math.abs(e.translationX) > Math.abs(e.translationY);

      if (isHorizontal) {
        translateX.value = e.translationX;
        scale.value = interpolate(Math.abs(e.translationX), [0, 120], [1, 0.93], Extrapolation.CLAMP);
        opacity.value = interpolate(Math.abs(e.translationX), [0, 120], [1, 0.7], Extrapolation.CLAMP);
      } else {
        translateY.value = Math.max(0, e.translationY);
        const progress = interpolate(e.translationY, [0, 150], [0, 1], Extrapolation.CLAMP);
        buttonScale.value = withSpring(1 + progress * 0.06, { damping: 16 });
        buttonGlow.value = progress;
        // Slight scale up while dragging down for drama
        scale.value = interpolate(e.translationY, [0, 150], [1, 1.08], Extrapolation.CLAMP);
      }
    })
    .onEnd((e) => {
      const isHorizontal = Math.abs(e.translationX) > Math.abs(e.translationY);

      if (isHorizontal) {
        if (e.translationX < -60) runOnJS(changePet)('next');
        else if (e.translationX > 60) runOnJS(changePet)('prev');
        else {
          translateX.value = withSpring(0);
          scale.value = withSpring(1);
          opacity.value = withSpring(1);
        }
      } else {
        if (e.translationY > 130) {
          runOnJS(startJourney)();
        }
        translateY.value = withSpring(0, { damping: 16 });
        buttonScale.value = withSpring(1);
        buttonGlow.value = withSpring(0);
        scale.value = withSpring(1);
      }

      runOnJS(setIsDragging)(false);
    });

  const petAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value * cinematicScale.value },
    ],
    opacity: opacity.value,
    zIndex: 100, // keeps the pet in front while dragging
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: buttonGlow.value > 0.5 ? '#9E2F2F' : '#B83F3F',
  }));

  const cinematicFlashStyle = useAnimatedStyle(() => ({
    opacity: cinematicOpacity.value,
  }));

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFF9F5',
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 10,
          paddingHorizontal: 14,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', gap: 14 }}>
          {/* LEFT — Pet Card */}
          <View
            style={{
              width: '46%',
              backgroundColor: '#FFF0EB',
              borderRadius: 28,
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 16,
              zIndex: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <TouchableOpacity onPress={() => changePet('prev')} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={30} color="#B83F3F" />
              </TouchableOpacity>

              <GestureDetector gesture={pan}>
                <Animated.View style={[{ alignItems: 'center' }, petAnimatedStyle]}>
                  <View
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 110,
                      backgroundColor: '#FFF7F2',
                      borderWidth: 3,
                      borderColor: '#E8B923',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={require('@/assets/images/duckpet.gif')}
                      style={{ width: '84%', height: '84%' }}
                      contentFit="contain"
                    />
                  </View>
                </Animated.View>
              </GestureDetector>

              <TouchableOpacity onPress={() => changePet('next')} activeOpacity={0.7}>
                <Ionicons name="chevron-forward" size={30} color="#B83F3F" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 22 }}>
              {PETS.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === activeIndex ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i === activeIndex ? '#B83F3F' : '#e0d5cf',
                  }}
                />
              ))}
            </View>
          </View>

          {/* RIGHT — Info Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 28,
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              paddingHorizontal: 18,
              paddingVertical: 18,
              justifyContent: 'space-between',
              zIndex: 5,
            }}
          >
            <View>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#FFF0EB',
                  paddingHorizontal: 11,
                  paddingVertical: 5,
                  borderRadius: 20,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#B83F3F', letterSpacing: 0.6 }}>
                  {currentPet.title}
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: 'PressStart2P_400Regular',
                  fontSize: 16,
                  color: '#1a1a1a',
                  marginBottom: 10,
                }}
              >
                {currentPet.name}
              </Text>

              <View
                style={{
                  backgroundColor: '#FFF9F5',
                  borderRadius: 16,
                  padding: 14,
                  borderWidth: 1.5,
                  borderColor: '#f0e6e0',
                }}
              >
                <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }} numberOfLines={4}>
                  {currentPet.description}
                </Text>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 }}>
                Name your pet
              </Text>
              <TextInput
                style={{
                  height: 46,
                  borderWidth: 1.5,
                  borderColor: '#f0e6e0',
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  fontSize: 15,
                  color: '#1a1a1a',
                  backgroundColor: '#FFF9F5',
                  marginBottom: 12,
                }}
                value={petName}
                onChangeText={setPetName}
                placeholder="Give them a name..."
                placeholderTextColor="#bbb"
              />

              <Animated.View
                style={[
                  {
                    height: 48,
                    borderRadius: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  buttonAnimatedStyle,
                ]}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>
                    {isDragging ? 'Drop pet here!' : 'Start Journey →'}
                  </Text>
                )}
              </Animated.View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // ==================== PORTRAIT ====================
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF9F5', paddingTop: insets.top + 12 }}>
      {/* Cinematic flash overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#E8B923',
            zIndex: 200,
          },
          cinematicFlashStyle,
        ]}
      />

      {/* Top text */}
      <View style={{ paddingHorizontal: 28, alignItems: 'center', marginBottom: 10, zIndex: 1 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '900',
            color: '#1a1a1a',
            letterSpacing: -0.5,
            textAlign: 'center',
            lineHeight: 30,
          }}
        >
          Break a habit with your lil
        </Text>
        <Text
          style={{
            fontFamily: 'PressStart2P_400Regular',
            fontSize: 15,
            color: '#B83F3F',
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          DIGITAL PET!
        </Text>
      </View>

      {/* Pet Stage - high zIndex so it stays in front while dragging */}
      <View
        style={{
          height: 280,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
          zIndex: 50,
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', left: 16, zIndex: 60 }}
          onPress={() => changePet('prev')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#B83F3F" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ position: 'absolute', right: 16, zIndex: 60 }}
          onPress={() => changePet('next')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={28} color="#B83F3F" />
        </TouchableOpacity>

        <GestureDetector gesture={pan}>
          <Animated.View style={[{ alignItems: 'center' }, petAnimatedStyle]}>
            <View
              style={{
                width: 220,
                height: 220,
                borderRadius: 110,
                backgroundColor: '#FFF7F2',
                borderWidth: 3.5,
                borderColor: '#E8B923',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#E8B923',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isDragging ? 0.6 : 0.2,
                shadowRadius: isDragging ? 24 : 12,
                elevation: isDragging ? 20 : 12,
              }}
            >
              <Image
                source={require('@/assets/images/duckpet.gif')}
                style={{ width: '85%', height: '85%' }}
                contentFit="contain"
              />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 18, zIndex: 1 }}>
        {PETS.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === activeIndex ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === activeIndex ? '#B83F3F' : '#e0d5cf',
            }}
          />
        ))}
      </View>

      {/* White Info Card */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderWidth: 1.5,
          borderColor: '#f0e6e0',
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: insets.bottom + 20,
          zIndex: 10,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: '#FFF0EB',
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 20,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#B83F3F', letterSpacing: 0.8 }}>
            {currentPet.title}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: 'PressStart2P_400Regular',
            fontSize: 20,
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: 14,
          }}
        >
          {currentPet.name}
        </Text>

        <View
          style={{
            backgroundColor: '#FFF9F5',
            borderRadius: 16,
            padding: 14,
            marginBottom: 22,
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
          }}
        >
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 }}>
            {currentPet.description}
          </Text>
        </View>

        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 }}>
          Name your new responsibility
        </Text>
        <TextInput
          style={{
            height: 50,
            borderWidth: 1.5,
            borderColor: '#f0e6e0',
            borderRadius: 14,
            paddingHorizontal: 16,
            fontSize: 15,
            color: '#1a1a1a',
            backgroundColor: '#FFF9F5',
            marginBottom: 16,
          }}
          value={petName}
          onChangeText={setPetName}
          placeholder="Give them a name..."
          placeholderTextColor="#bbb"
        />

        <Animated.View
          style={[
            {
              height: 54,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
            },
            buttonAnimatedStyle,
          ]}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>
              {isDragging ? 'Drop pet here!' : 'Start Journey →'}
            </Text>
          )}
        </Animated.View>
      </View>
    </View>
  );
}