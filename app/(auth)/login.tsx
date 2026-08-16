import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            paddingTop: 40,
            paddingBottom: 40,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo + Title */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: '#FFF0EB',
                borderWidth: 2.5,
                borderColor: '#E8B923',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Ionicons name="skull" size={40} color="#B83F3F" />
            </View>

            <Text
              style={{
                fontFamily: 'PressStart2P_400Regular',
                fontSize: 18,
                color: '#1a1a1a',
                marginBottom: 8,
              }}
            >
              Doomagotchi
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: '#777',
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Save your pet from the scroll
            </Text>
          </View>

          {/* Email */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: '#777',
              marginBottom: 8,
              letterSpacing: 0.5,
            }}
          >
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
              marginBottom: 20,
            }}
          />

          {/* Password */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: '#777',
              marginBottom: 8,
              letterSpacing: 0.5,
            }}
          >
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
              marginBottom: 10,
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

          {/* Forgot */}
          <Pressable style={{ alignSelf: 'flex-end', marginBottom: 32 }}>
            <Text style={{ fontSize: 13, color: '#999' }}>Forgot?</Text>
          </Pressable>

          {/* Log In button */}
          <Pressable
            style={{
              backgroundColor: '#B83F3F',
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 24,
              shadowColor: '#B83F3F',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>
              Log In →
            </Text>
          </Pressable>

          {/* OR divider */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: '#f0e6e0' }} />
            <Text
              style={{
                marginHorizontal: 14,
                fontSize: 12,
                color: '#999',
                fontWeight: '600',
              }}
            >
              OR
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#f0e6e0' }} />
          </View>

          {/* Google button */}
          <Pressable
            style={{
              backgroundColor: '#fff',
              borderWidth: 1.5,
              borderColor: '#f0e6e0',
              borderRadius: 14,
              paddingVertical: 15,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 28,
            }}
          >
            <Ionicons name="logo-google" size={18} color="#1a1a1a" />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' }}>
              Continue with Google
            </Text>
          </Pressable>

          {/* Sign up */}
          <Pressable style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#777' }}>
              Don’t have an account?{' '}
              <Text style={{ color: '#B83F3F', fontWeight: '700' }}>Sign up</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}