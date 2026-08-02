import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

const { width } = Dimensions.get('window');

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
        if (direction === 'next') {
          return (prev + 1) % PETS.length;
        } else {
          return (prev - 1 + PETS.length) % PETS.length;
        }
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
        if (e.translationX < -60) {
          runOnJS(changePet)('next');
        } else if (e.translationX > 60) {
          runOnJS(changePet)('prev');
        } else {
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

  return (
    <View style={[styles.container, { paddingTop: insets.top + 18 }]}>
      {/* Header */}
      <View style={styles.topSection}>
        <Text style={styles.headerTitle}>
          Break a habit with your lil
        </Text>
        <Text style={styles.pixelTitle}>DIGITAL PET!</Text>

        <View style={styles.accentLine} />

        <Text style={styles.subtitle}>
          Choose carefully. They’re about to depend on you.
        </Text>
      </View>

      {/* Pet Stage */}
      <View style={styles.stage}>
        <TouchableOpacity
          style={[styles.arrow, styles.arrowLeft]}
          onPress={() => changePet('prev')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FF6B6B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrow, styles.arrowRight]}
          onPress={() => changePet('next')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={28} color="#FF6B6B" />
        </TouchableOpacity>

        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.petWrapper, petAnimatedStyle]}>
            <View style={styles.circleFrame}>
              <Image
                source={require('@/assets/images/duckpet.gif')}
                style={styles.petImage}
                contentFit="contain"
              />
            </View>

            <Text style={styles.petTitle}>{currentPet.title}</Text>
            <Text style={styles.petName}>{currentPet.name}</Text>
            <Text style={styles.petDescription}>{currentPet.description}</Text>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {PETS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Name input */}
      <View style={styles.nameSection}>
        <Text style={styles.nameLabel}>Name your new responsibility</Text>
        <TextInput
          style={styles.nameInput}
          value={petName}
          onChangeText={setPetName}
          placeholder="Give them a name..."
          placeholderTextColor="#bbb"
        />
      </View>

      {/* Button */}
      <Animated.View style={[styles.startButton, buttonAnimatedStyle]}>
        <Text style={styles.startButtonText}>
          {isDragging ? 'Drop pet here!' : 'Start Journey →'}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  topSection: {
    paddingHorizontal: 28,
    marginBottom: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: -0.6,
    textAlign: 'center',
    lineHeight: 33,
  },
  pixelTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  accentLine: {
    width: 36,
    height: 3,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#777',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  stage: {
    height: 340,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    position: 'absolute',
    top: '32%',
    zIndex: 10,
    padding: 10,
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  petWrapper: {
    alignItems: 'center',
    width: width * 0.75,
  },
  circleFrame: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  petImage: {
    width: '88%',
    height: '88%',
  },
  petTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF6B6B',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  petName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  petDescription: {
    fontSize: 13.5,
    color: '#666',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    marginBottom: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0d5cf',
  },
  dotActive: {
    backgroundColor: '#FF6B6B',
    width: 22,
  },
  nameSection: {
    paddingHorizontal: 24,
    marginBottom: 18,
    marginTop: 4,
  },
  nameLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  nameInput: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  startButton: {
    marginHorizontal: 24,
    height: 54,
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});