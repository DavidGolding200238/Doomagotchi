import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const CHANNEL_ID = 'pet-health';

export async function setupNotifications(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Pet Health',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#B83F3F',
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function notifyPetSick(petName: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your pet is getting sick',
      body: `${petName} is struggling. Put the phone down.`,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: null, // fire immediately
  });
}

export async function notifyPetDead(petName: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your pet has died',
      body: `${petName} didn’t make it. Open Doomagotchi.`,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: null,
  });
}

export async function notifyOverLimit(petName: string, minutes: number, limit: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Over the limit',
      body: `${petName} is taking damage — ${minutes}m / ${limit}m today.`,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: null,
  });
}