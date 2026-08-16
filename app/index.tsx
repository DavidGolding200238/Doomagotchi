import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import { Redirect } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [checkingPet, setCheckingPet] = useState(true);
  const [hasPet, setHasPet] = useState(false);

  useEffect(() => {
    async function checkPet() {
      if (!user) {
        setCheckingPet(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists() && userDoc.data()?.pet) {
          setHasPet(true);
        } else {
          setHasPet(false);
        }
      } catch (error) {
        console.log('Error checking pet:', error);
        setHasPet(false);
      } finally {
        setCheckingPet(false);
      }
    }

    if (!authLoading) {
      checkPet();
    }
  }, [user, authLoading]);

  if (authLoading || checkingPet) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9F5' }}>
        <ActivityIndicator size="large" color="#B83F3F" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (hasPet) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/petselection" />;
}