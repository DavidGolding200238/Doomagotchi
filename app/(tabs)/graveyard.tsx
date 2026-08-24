import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import { styles } from '@/styles/graveyard.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const DUCK_DEAD = require('@/assets/pets/Duck/Duck Dead.gif');
const SPINO_DEAD = require('@/assets/pets/Spinosaurus/Dead spino.gif');
const PANDA_DEAD = require('@/assets/pets/Panda/Dead Panda.gif');
const LOGO_SKULL = require('@/assets/images/Logo Skull.png');

const DEAD_IMAGE: Record<string, any> = {
  Nugget: PANDA_DEAD,
  Waddles: DUCK_DEAD,
  Spino: SPINO_DEAD,
};

function petImage(type?: string) {
  return DEAD_IMAGE[type ?? ''] ?? DUCK_DEAD;
}

type FallenPet = {
  id: string;
  name: string;
  type?: string;
  days: number;
  cause: string;
  date: string;
  epitaph: string;
};

export default function GraveyardScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { user } = useAuth();

  const [fallen, setFallen] = useState<FallenPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<FallenPet | null>(null);
  const insets = useSafeAreaInsets();

  const modalWidth = Math.min(320, width - 40);

  useEffect(() => {
    async function loadGraveyard() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'users', user.uid, 'graveyard'),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const pets: FallenPet[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<FallenPet, 'id'>),
        }));
        setFallen(pets);
      } catch (error) {
        console.log('Error loading graveyard:', error);
        setFallen([]);
      } finally {
        setLoading(false);
      }
    }

    loadGraveyard();
  }, [user]);

  const bestStreak = fallen.length > 0 ? Math.max(...fallen.map((p) => p.days)) : 0;

  const GravestoneModal = () => {
    if (!selectedPet) return null;

    return (
      <Modal visible={!!selectedPet} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedPet(null)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[styles.modalCard, { width: modalWidth, maxHeight: height * 0.85 }]}
          >
            <View style={styles.modalPetWrap}>
              <Image
                source={petImage(selectedPet.type)}
                style={{ width: 88, height: 88, opacity: 0.85 }}
                contentFit="contain"
              />
              <View style={styles.modalShadow} />
            </View>

            <Text style={styles.modalName}>{selectedPet.name}</Text>
            <Text style={styles.modalDays}>Lived {selectedPet.days} days</Text>

            <View style={styles.modalCausePill}>
              <Text style={styles.modalCauseText}>{selectedPet.cause}</Text>
            </View>

            <View style={styles.modalEpitaphWrap}>
              <Text style={styles.modalEpitaph}>{selectedPet.epitaph}</Text>
            </View>

            <Text style={styles.modalDate}>{selectedPet.date}</Text>

            {/* Landscape only: circular X close button in bottom-right */}
            {isLandscape ? (
              <Pressable onPress={() => setSelectedPet(null)} style={styles.modalCloseBtnCircle}>
                <Ionicons name="close" size={20} color="#fff" />
              </Pressable>
            ) : (
              <Pressable onPress={() => setSelectedPet(null)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeRed, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F5E6D3" />
      </SafeAreaView>
    );
  }

  if (isLandscape) {
    return (
     <SafeAreaView style={styles.safeRed} edges={['top', 'left', 'right']}>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: '#B83F3F',
          zIndex: 999,
        }}
      />


        <View style={styles.landscapeRow}>
          <ScrollView
            style={styles.landscapeScroll}
            contentContainerStyle={styles.landscapeScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {fallen.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="skull-outline" size={40} color="#5A4038" />
                <Text style={styles.emptyTitle}>No fallen pets yet</Text>
                <Text style={styles.emptyBody}>
                  Keep your current pet alive.{'\n'}This place fills when you fail.
                </Text>
              </View>
            ) : (
              fallen.map((pet) => (
                <Pressable key={pet.id} onPress={() => setSelectedPet(pet)} style={styles.petCard}>
                  <View style={styles.petAvatar}>
                    <Image
                      source={petImage(pet.type)}
                      style={{ width: '84%', height: '84%', opacity: 0.85 }}
                      contentFit="contain"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petDays}>Lived {pet.days} days</Text>
                    <View style={styles.causePill}>
                      <Text style={styles.causeText}>{pet.cause}</Text>
                    </View>
                    <Text style={styles.petDate}>{pet.date}</Text>
                  </View>
                </Pressable>
              ))
            )}

            <View style={styles.reservedPlot}>
              <Text style={styles.reservedText}>This plot is reserved for your current pet</Text>
            </View>
          </ScrollView>

          <View style={styles.landscapeRight}>
            <Image
              source={LOGO_SKULL}
              style={{ width: 70, height: 70 }}
              contentFit="contain"
            />
            <Text style={styles.landscapeTitle}>
              Eternal Resting{'\n'}Place
            </Text>
            <Text style={styles.landscapeSubtitle}>Every scroll cost a soul.</Text>
            <View style={styles.landscapeStatsRow}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.landscapeStatLabel}>SOULS</Text>
                <Text style={styles.landscapeStatValue}>{fallen.length}</Text>
              </View>
              <View style={styles.landscapeDivider} />
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.landscapeStatLabel}>BEST</Text>
                <Text style={styles.landscapeStatValue}>{bestStreak}d</Text>
              </View>
            </View>
          </View>
        </View>
        <GravestoneModal />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeRed} edges={['top']}>
      <View style={styles.darkBg}>
        <ScrollView contentContainerStyle={styles.portraitScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.portraitHeader}>
            <Image
              source={LOGO_SKULL}
              style={{ width: 70, height: 70, marginBottom: 14 }}
              contentFit="contain"
            />
            <Text style={styles.portraitTitle}>Eternal Resting Place</Text>
            <Text style={styles.portraitSubtitle}>
              Every scroll cost a soul.{'\n'}Remember those who suffered.
            </Text>
          </View>

          <View style={styles.portraitStatsBar}>
            <View style={styles.portraitStatCell}>
              <Text style={styles.portraitStatLabel}>TOTAL SOULS</Text>
              <Text style={styles.portraitStatValue}>{fallen.length}</Text>
            </View>
            <View style={styles.portraitStatsDivider} />
            <View style={styles.portraitStatCell}>
              <Text style={styles.portraitStatLabel}>BEST STREAK</Text>
              <Text style={styles.portraitStatValue}>{bestStreak}d</Text>
            </View>
          </View>

          {fallen.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="skull-outline" size={48} color="#5A4038" />
              <Text style={styles.emptyTitle}>No fallen pets yet</Text>
              <Text style={styles.emptyBody}>
                Keep your current pet alive.{'\n'}This place fills when you fail.
              </Text>
            </View>
          ) : (
            <View style={styles.cardsList}>
              {fallen.map((pet) => (
                <Pressable key={pet.id} onPress={() => setSelectedPet(pet)} style={styles.petCard}>
                  <View style={styles.petAvatar}>
                    <Image
                      source={petImage(pet.type)}
                      style={{ width: '84%', height: '84%', opacity: 0.85 }}
                      contentFit="contain"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petDays}>Lived {pet.days} days</Text>
                    <View style={styles.causePill}>
                      <Text style={styles.causeText}>{pet.cause}</Text>
                    </View>
                    <Text style={styles.petDate}>{pet.date}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.reservedPlot}>
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color="#B83F3F"
              style={{ marginBottom: 6 }}
            />
            <Text style={styles.reservedText}>
              This plot is reserved{'\n'}for your current pet
            </Text>
          </View>

          <View style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <Ionicons name="moon-outline" size={15} color="#E8D5C4" />
              <Text style={styles.lessonTitle}>A Lesson from the Past</Text>
            </View>
            <Text style={styles.lessonBody}>
              Most of them died between 2 AM and 4 AM. Charge your phone in another room tonight.
            </Text>
            <Pressable>
              <Text style={styles.lessonLink}>Set Sleep Habits</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
      <GravestoneModal />
    </SafeAreaView>
  );
}