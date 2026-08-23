import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import { buryPet, type ActivePet } from '@/services/graveyard';
import { styles } from '@/styles/rest.styles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
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
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DUCK_DEAD = require('@/assets/pets/Duck/Duck Dead.gif');
const SPINO_DEAD = require('@/assets/pets/Spinosaurus/Dead spino.gif');
const PANDA_DEAD = require('@/assets/pets/Panda/Dead Panda.gif');
const LOGO_SKULL = require('@/assets/images/Logo Skull.png');

const DEAD_IMAGE: Record<string, any> = {
  Nugget: PANDA_DEAD,
  Waddles: DUCK_DEAD,
  Spino: SPINO_DEAD,

};

export default function RestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [pet, setPet] = useState<ActivePet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEpitaph, setShowEpitaph] = useState(false);
  const [epitaph, setEpitaph] = useState('');
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const buttonGlow = useSharedValue(0);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const raw = snap.data()?.pet;
        if (!raw) {
          router.replace('/petselection');
          return;
        }
        setPet(raw as ActivePet);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const openEpitaph = () => {
    setShowEpitaph(true);
  };

  const confirmBury = async () => {
    if (!user || !pet) return;
    try {
      setSaving(true);
      await buryPet(user.uid, pet, epitaph);
      setShowEpitaph(false);
      router.replace('/petselection');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not bury pet');
      setSaving(false);
    }
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setIsDragging)(true);
    })
    .onUpdate((e) => {
      const dy = Math.max(0, e.translationY);
      translateY.value = dy;

      const progress = interpolate(dy, [0, 150], [0, 1], Extrapolation.CLAMP);
      buttonScale.value = withSpring(1 + progress * 0.06, { damping: 16 });
      buttonGlow.value = progress;
      scale.value = interpolate(dy, [0, 150], [1, 1.08], Extrapolation.CLAMP);
    })
    .onEnd((e) => {
      if (e.translationY > 130) {
        runOnJS(openEpitaph)();
      }
      translateY.value = withSpring(0, { damping: 16 });
      buttonScale.value = withSpring(1);
      buttonGlow.value = withSpring(0);
      scale.value = withSpring(1);
      runOnJS(setIsDragging)(false);
    });

  const petAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: buttonGlow.value > 0.5 ? '#3D1F1C' : '#2A1F1C',
    borderColor: buttonGlow.value > 0.5 ? '#E07A6A' : '#B83F3F',
  }));

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#B83F3F" />
      </View>
    );
  }

  if (!pet) return null;

  const deathDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const daysLived = (() => {
    const start = new Date(pet.createdAt || Date.now()).getTime();
    return Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
  })();

  const image = DEAD_IMAGE[pet.type] ?? DUCK_DEAD;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lay to rest</Text>
        <Text style={styles.headerSub}>
          Drag your pet down into the graveyard.{'\n'}Then write their stone.
        </Text>
      </View>

      <View style={styles.stage}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.petAnimatedWrap, petAnimatedStyle]}>
            <View
              style={[
                styles.petCircle,
                {
                  shadowColor: '#B83F3F',
                  shadowOpacity: isDragging ? 0.55 : 0.25,
                  shadowRadius: isDragging ? 22 : 10,
                  elevation: 0,
                },
              ]}
            >
              <Image source={image} style={styles.petImage} contentFit="contain" />
            </View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Image
              source={LOGO_SKULL}
              style={{ width: 66, height: 66, marginTop: 6 }}
              contentFit="contain"
            />
          </Animated.View>
        </GestureDetector>
      </View>

      <Text style={[styles.dropHint, { marginBottom: 6 }]}>
        {isDragging ? 'Keep dragging down…' : 'Drag pet down to bury'}
      </Text>

      <Animated.View
        style={[
          styles.dropZone,
          buttonAnimatedStyle,
          { marginBottom: insets.bottom + 18 },
        ]}
      >
        <Text style={styles.dropText}>
          {isDragging ? 'Drop pet here!' : 'Graveyard'}
        </Text>
      </Animated.View>

      <Modal visible={showEpitaph} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.sheetOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <Text style={styles.sheetTitle}>Write the stone</Text>
            <Text style={styles.sheetSub}>Date is filled in. Only the message is yours.</Text>

            <View style={styles.stone}>
              <Text style={styles.stoneName}>Here lies {pet.name}</Text>
              <Text style={styles.stoneLine}>
                Lived {daysLived} day{daysLived === 1 ? '' : 's'}
              </Text>
              <Text style={styles.stoneLine}>Cause: Doomscrolling</Text>
              <Text style={styles.stoneDate}>{deathDate}</Text>
            </View>

            <Text style={styles.label}>RESTING MESSAGE</Text>
            <TextInput
              style={styles.input}
              value={epitaph}
              onChangeText={setEpitaph}
              placeholder="Sorry buddy. Phone stays in the kitchen tonight."
              placeholderTextColor="#6B5E56"
              multiline
              maxLength={140}
            />

            <Pressable style={styles.buryBtn} onPress={confirmBury} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buryBtnText}>Bury & choose new pet</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.cancelBtn}
              onPress={() => !saving && setShowEpitaph(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}