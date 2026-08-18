import { auth, db } from '@/services/firebase';
import { styles } from '@/styles/petselection.styles';
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
  const [petName, setPetName] = useState('');
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

      cinematicScale.value = withSequence(
        withTiming(1.25, { duration: 300 }),
        withTiming(1, { duration: 400 })
      );
      cinematicOpacity.value = withSequence(
        withTiming(0.7, { duration: 200 }),
        withTiming(0, { duration: 600 })
      );

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
    zIndex: 100,
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
        style={[
          styles.landscapeContainer,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 10,
            paddingHorizontal: 14,
          },
        ]}
      >
        <View style={styles.landscapeRow}>
          {/* LEFT — Pet Card */}
          <View style={styles.landscapePetCard}>
            <View style={styles.landscapePetControls}>
              <TouchableOpacity onPress={() => changePet('prev')} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={30} color="#B83F3F" />
              </TouchableOpacity>

              <GestureDetector gesture={pan}>
                <Animated.View style={[styles.petAnimatedWrap, petAnimatedStyle]}>
                  <View style={styles.landscapePetCircle}>
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

            <View style={styles.landscapeDots}>
              {PETS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width: i === activeIndex ? 20 : 8,
                      backgroundColor: i === activeIndex ? '#B83F3F' : '#e0d5cf',
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* RIGHT — Info Card */}
          <View style={styles.landscapeInfoCard}>
            <View>
              <View style={styles.landscapeTitlePill}>
                <Text style={styles.landscapeTitlePillText}>{currentPet.title}</Text>
              </View>

              <Text style={styles.landscapePetName}>{currentPet.name}</Text>

              <View style={styles.landscapeDescriptionBox}>
                <Text style={styles.landscapeDescriptionText} numberOfLines={4}>
                  {currentPet.description}
                </Text>
              </View>
            </View>

            <View>
              <Text style={styles.landscapeNameLabel}>Name your pet</Text>
              <TextInput
                style={styles.landscapeNameInput}
                value={petName}
                onChangeText={setPetName}
                placeholder="Give them a name..."
                placeholderTextColor="#bbb"
              />

              <Animated.View style={[styles.landscapeStartButton, buttonAnimatedStyle]}>
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.landscapeStartButtonText}>
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
    <View style={[styles.portraitContainer, { paddingTop: insets.top + 12 }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.cinematicFlash, cinematicFlashStyle]}
      />

      <View style={styles.portraitTopText}>
        <Text style={styles.portraitHeaderTitle}>Break a habit with your lil</Text>
        <Text style={styles.portraitPixelTitle}>DIGITAL PET!</Text>
      </View>

      <View style={styles.portraitStage}>
        <TouchableOpacity
          style={styles.portraitArrowLeft}
          onPress={() => changePet('prev')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#B83F3F" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.portraitArrowRight}
          onPress={() => changePet('next')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={28} color="#B83F3F" />
        </TouchableOpacity>

        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.petAnimatedWrap, petAnimatedStyle]}>
            <View
              style={[
                styles.portraitPetCircle,
                {
                  shadowOpacity: isDragging ? 0.6 : 0.2,
                  shadowRadius: isDragging ? 24 : 12,
                  elevation: isDragging ? 20 : 12,
                },
              ]}
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

      <View style={styles.portraitDots}>
        {PETS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === activeIndex ? 20 : 8,
                backgroundColor: i === activeIndex ? '#B83F3F' : '#e0d5cf',
              },
            ]}
          />
        ))}
      </View>

      <View style={[styles.portraitInfoCard, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.portraitTitlePill}>
          <Text style={styles.portraitTitlePillText}>{currentPet.title}</Text>
        </View>

        <Text style={styles.portraitPetName}>{currentPet.name}</Text>

        <View style={styles.portraitDescriptionBox}>
          <Text style={styles.portraitDescriptionText}>{currentPet.description}</Text>
        </View>

        <Text style={styles.portraitNameLabel}>Name your new responsibility</Text>
        <TextInput
          style={styles.portraitNameInput}
          value={petName}
          onChangeText={setPetName}
          placeholder="Give them a name..."
          placeholderTextColor="#bbb"
        />

        <Animated.View style={[styles.portraitStartButton, buttonAnimatedStyle]}>
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.portraitStartButtonText}>
              {isDragging ? 'Drop pet here!' : 'Start Journey →'}
            </Text>
          )}
        </Animated.View>
      </View>
    </View>
  );
}