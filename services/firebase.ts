import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// @ts-expect-error
import { getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB1ZSOKrmZB6Q4cIZCvOCQHa4HW3AK5_Hg",
  authDomain: "doomagotchi-842fc.firebaseapp.com",
  projectId: "doomagotchi-842fc",
  storageBucket: "doomagotchi-842fc.firebasestorage.app",
  messagingSenderId: "143920237709",
  appId: "1:143920237709:web:6269890a06f5d5127e26c4",
  measurementId: "G-1S3HFVBWBG",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };

