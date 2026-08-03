import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f0e6e0',
          height: 60,
          paddingBottom: 6,
        },
      }}
    >
      {/* 1. Main Pet Page */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Main',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Calendar / Stats Page */}
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Cemetery / Graveyard Page */}
      <Tabs.Screen
        name="graveyard"
        options={{
          title: 'Cemetery',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="skull" size={size} color={color} />
          ),
        }}
      />

      {/* Hide the pet selection screen from the navbar */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}