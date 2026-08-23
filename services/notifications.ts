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

async function send(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: null,
  });
}

export async function notifyPetFull(petName: string) {
  await send('Full health', `${petName} is at 100%. Keep it up.`);
}

export async function notifyPetSick(petName: string) {
  await send('Your pet is getting sick', `${petName} is struggling. Put the phone down.`);
}

export async function notifyPetGettingSicker(petName: string, health: number) {
  await send(
    'Getting worse',
    `${petName} is still taking damage — down to ${health}%.`
  );
}

export async function notifyPetNearDeath(petName: string, health: number) {
  await send(
    'Near death',
    `${petName} is almost gone (${health}%). Stop scrolling now.`
  );
}

export async function notifyPetDead(petName: string) {
  await send('Your pet has died', `${petName} didn’t make it. Open Doomagotchi.`);
}

export async function notifyOverLimit(petName: string, minutes: number, limit: number) {
  await send(
    'Over the limit',
    `${petName} is taking damage — ${minutes}m / ${limit}m today.`
  );
}