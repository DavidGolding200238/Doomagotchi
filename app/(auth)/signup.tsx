import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Missing fields', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Password mismatch', 'Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Weak password', 'Password must be at least 6 characters.');
            return;
        }

        try {
            setLoading(true);
            await signUp(email.trim(), password);
            router.replace('/petselection');
        } catch (error: any) {
            Alert.alert('Signup failed', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#B83F3F' }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FFF9F5' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 28,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 6 }}
          >
            <Ionicons name="arrow-back" size={22} color="#B83F3F" />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#B83F3F' }}>Back</Text>
          </Pressable>

          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 18,
                color: '#1a1a1a',
                marginBottom: 8,
              }}
            >
              Create Account
            </Text>
            <Text style={{ fontSize: 14, color: '#777', textAlign: 'center' }}>
              Your pet is waiting for you
            </Text>
          </View>

          {/* Email */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#777', marginBottom: 8 }}>
            EMAIL
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#bbb"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              backgroundColor: '#fff',
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 15,
              color: '#1a1a1a',
              marginBottom: 18,
            }}
          />

          {/* Password */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#777', marginBottom: 8 }}>
            PASSWORD
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              borderRadius: 14,
              marginBottom: 18,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPassword}
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 15,
                color: '#1a1a1a',
              }}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{ paddingHorizontal: 16, paddingVertical: 14 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#B83F3F' }}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </Text>
            </Pressable>
          </View>

          {/* Confirm Password */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#777', marginBottom: 8 }}>
            CONFIRM PASSWORD
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              borderRadius: 14,
              marginBottom: 28,
            }}
          >
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              secureTextEntry={!showConfirm}
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 15,
                color: '#1a1a1a',
              }}
            />
            <Pressable
              onPress={() => setShowConfirm(!showConfirm)}
              style={{ paddingHorizontal: 16, paddingVertical: 14 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#B83F3F' }}>
                {showConfirm ? 'HIDE' : 'SHOW'}
              </Text>
            </Pressable>
          </View>

          {/* Sign Up button */}
          <Pressable
            onPress={handleSignup}
            disabled={loading}
            style={{
              backgroundColor: '#B83F3F',
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 24,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>
                Create Account →
              </Text>
            )}
          </Pressable>

          {/* Back to Login */}
          <Pressable style={{ alignItems: 'center' }} onPress={() => router.back()}>
            <Text style={{ fontSize: 14, color: '#777' }}>
              Already have an account?{' '}
              <Text style={{ color: '#B83F3F', fontWeight: '700' }}>Log in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}