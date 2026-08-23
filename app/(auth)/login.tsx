import { useAuth } from '@/context/AuthContext';
import { styles } from '@/styles/login.styles';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

// Firebase Console → Authentication → Google → Web client ID
const GOOGLE_WEB_CLIENT_ID =
  '143920237709-gm9e0ubqq59lht156ahavogl1d87iiic.apps.googleusercontent.com';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogleIdToken } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

 const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: GOOGLE_WEB_CLIENT_ID,
  androidClientId: GOOGLE_WEB_CLIENT_ID,
  webClientId: GOOGLE_WEB_CLIENT_ID,
  extraParams: {
    prompt: 'select_account',
  },
});

  useEffect(() => {
    if (response?.type !== 'success') return;

    const idToken = response.params.id_token;
    if (!idToken) {
      Alert.alert('Google Sign-In failed', 'No ID token returned.');
      return;
    }

    (async () => {
      try {
        setGoogleLoading(true);
        await signInWithGoogleIdToken(idToken);
        router.replace('/');
      } catch (error: any) {
        Alert.alert('Google Sign-In failed', error.message || 'Something went wrong');
      } finally {
        setGoogleLoading(false);
      }
    })();
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
  try {
    setGoogleLoading(true);
    await promptAsync();
  } catch (error: any) {
    Alert.alert('Google Sign-In failed', error.message || 'Something went wrong');
    setGoogleLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Image
                source={require('@/assets/images/Logo Skull.png')}
                style={{ width: 106, height: 100 }}
                contentFit="contain"
              />
            </View>

            <Text style={styles.appTitle}>Doomagotchi</Text>
            <Text style={styles.appSubtitle}>Save your pet from the scroll</Text>
          </View>

          <Text style={styles.fieldLabel}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#bbb"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showHideBtn}
            >
              <Text style={styles.showHideText}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </Text>
            </Pressable>
          </View>

          <Pressable style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot?</Text>
          </Pressable>

          <Pressable
            onPress={handleLogin}
            disabled={loading || googleLoading}
            style={[styles.loginBtn, { opacity: loading ? 0.7 : 1 }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Log In →</Text>
            )}
          </Pressable>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <Pressable
            onPress={handleGoogle}
            disabled={!request || loading || googleLoading}
            style={[styles.googleBtn, { opacity: googleLoading ? 0.7 : 1 }]}
          >
            {googleLoading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : (
              <>
                <Ionicons name="logo-google" size={18} color="#1a1a1a" />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={styles.signupRow}
            onPress={() => router.push('/(auth)/signup' as any)}
          >
            <Text style={styles.signupText}>
              Don’t have an account?{' '}
              <Text style={styles.signupLink}>Sign up</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}