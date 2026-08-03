import { styles } from '@/styles/petselection.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
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
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [activeIndex, setActiveIndex] = useState(0);
  const [petName, setPetName] = useState('McHammer');
  const [isDragging, setIsDragging] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const buttonGlow = useSharedValue(0);

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

  const startJourney = () => {
    console.log('Selected:', currentPet.name, 'Name:', petName);
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
        if (e.translationY > 130) runOnJS(startJourney)();
        translateY.value = withSpring(0, { damping: 16 });
        buttonScale.value = withSpring(1);
        buttonGlow.value = withSpring(0);
      }

      runOnJS(setIsDragging)(false);
    });

  const petAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: buttonGlow.value > 0.5 ? '#FF5252' : '#FF6B6B',
  }));

  // ==================== LANDSCAPE ====================
  if (isLandscape) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 10,
            paddingHorizontal: 14,
          },
        ]}
      >
        <View style={{ flex: 1, flexDirection: 'row', gap: 12 }}>
          {/* LEFT — Pet */}
          <View
            style={{
              width: '46%',
              backgroundColor: '#fff',
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 }}>
              <TouchableOpacity onPress={() => changePet('prev')} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={30} color="#FF6B6B" />
              </TouchableOpacity>

              <GestureDetector gesture={pan}>
                <Animated.View style={[{ alignItems: 'center' }, petAnimatedStyle]}>
                  <View
  style={{
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FFF7F2',
    borderWidth: 3,
    borderColor: '#FF6B6B',
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
    source={require('@/assets/images/duckpet.gif')}
    style={{ width: '84%', height: '84%' }}
    contentFit="contain"
  />
</View>
                </Animated.View>
              </GestureDetector>

              <TouchableOpacity onPress={() => changePet('next')} activeOpacity={0.7}>
                <Ionicons name="chevron-forward" size={30} color="#FF6B6B" />
              </TouchableOpacity>
            </View>

            {/* Carousel */}
            <View style={[styles.dots, { marginTop: 28 }]}>
              {PETS.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeIndex && styles.dotActive]}
                />
              ))}
            </View>
          </View>

          {/* RIGHT — Info */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              paddingHorizontal: 16,
              paddingVertical: 14,
              justifyContent: 'space-between',
            }}
          >
            <View>
              {/* Title tag */}
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#FFF0EB',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '800',
                    color: '#FF6B6B',
                    letterSpacing: 0.6,
                  }}
                >
                  {currentPet.title}
                </Text>
              </View>

              {/* Name */}
              <Text
                style={{
                  fontFamily: 'PressStart2P_400Regular',
                  fontSize: 16,
                  color: '#1a1a1a',
                  marginBottom: 8,
                }}
              >
                {currentPet.name}
              </Text>

              {/* Description */}
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 18,
                }}
                numberOfLines={3}
              >
                {currentPet.description}
              </Text>
            </View>

            <View>
              <Text style={[styles.nameLabel, { fontSize: 13, marginBottom: 6 }]}>
                Name your pet
              </Text>
              <TextInput
                style={[styles.nameInput, { height: 42, fontSize: 14 }]}
                value={petName}
                onChangeText={setPetName}
                placeholder="Give them a name..."
                placeholderTextColor="#bbb"
              />

              <Animated.View
                style={[
                  styles.startButton,
                  buttonAnimatedStyle,
                  { marginTop: 10, height: 44 },
                ]}
              >
                <Text style={[styles.startButtonText, { fontSize: 14 }]}>
                  {isDragging ? 'Drop pet here!' : 'Start Journey →'}
                </Text>
              </Animated.View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // ==================== PORTRAIT ====================
  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      {/* Top text */}
      <View style={{ paddingHorizontal: 28, alignItems: 'center', marginBottom: 8 }}>
        <Text style={styles.headerTitle}>Break a habit with your lil</Text>
        <Text style={styles.pixelTitle}>DIGITAL PET!</Text>
      </View>

      {/* Pet Stage */}
      <View
        style={{
          height: 280,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', left: 16, zIndex: 10 }}
          onPress={() => changePet('prev')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FF6B6B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ position: 'absolute', right: 16, zIndex: 10 }}
          onPress={() => changePet('next')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={28} color="#FF6B6B" />
        </TouchableOpacity>

        <GestureDetector gesture={pan}>
          <Animated.View style={[{ alignItems: 'center' }, petAnimatedStyle]}>
            <View
              style={{
                width: 210,
                height: 210,
                borderRadius: 105,
                backgroundColor: '#FFF0EB',
                borderWidth: 3,
                borderColor: '#FF6B6B',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#FF6B6B',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.18,
                shadowRadius: 14,
                elevation: 6,
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
      <View style={[styles.dots, { marginBottom: 16 }]}>
        {PETS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Info Card */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderWidth: 1.5,
          borderColor: '#f0e6e0',
          paddingHorizontal: 24,
          paddingTop: 22,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Title tag */}
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: '#FFF0EB',
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 20,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '800',
              color: '#FF6B6B',
              letterSpacing: 0.8,
            }}
          >
            {currentPet.title}
          </Text>
        </View>

        {/* Name */}
        <Text
          style={[
            styles.petName,
            { textAlign: 'center', fontSize: 22, marginBottom: 12 },
          ]}
        >
          {currentPet.name}
        </Text>

        {/* Description block */}
        <View
          style={{
            backgroundColor: '#FFF9F5',
            borderRadius: 14,
            padding: 14,
            marginBottom: 22,
          }}
        >
          <Text style={[styles.petDescription, { textAlign: 'center', marginBottom: 0 }]}>
            {currentPet.description}
          </Text>
        </View>

        <Text style={styles.nameLabel}>Name your new responsibility</Text>
        <TextInput
          style={styles.nameInput}
          value={petName}
          onChangeText={setPetName}
          placeholder="Give them a name..."
          placeholderTextColor="#bbb"
        />

        <Animated.View style={[styles.startButton, buttonAnimatedStyle, { marginTop: 16 }]}>
          <Text style={styles.startButtonText}>
            {isDragging ? 'Drop pet here!' : 'Start Journey →'}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}