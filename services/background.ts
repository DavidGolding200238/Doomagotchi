import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/services/firebase';
import { applyHealthTick, type PetHealthState } from '@/services/health';
import {
    notifyOverLimit,
    notifyPetDead,
    notifyPetFull,
    notifyPetGettingSicker,
    notifyPetNearDeath,
    notifyPetSick,
} from '@/services/notifications';
import {
    getPetScrollMinutes,
    getUTCDateKey,
    hasUsagePermission,
    resolveTrackedPackages,
} from '@/services/usage';

export const BACKGROUND_HEALTH_TASK = 'doomagotchi-health-tick';

export type NotifyBand =
  | 'full'
  | 'healthy'
  | 'over'
  | 'sick'
  | 'sicker'
  | 'near_death'
  | 'dead';

type PetData = {
  id: string;
  type: string;
  name: string;
  createdAt: string;
  health?: number;
  happiness?: number;
  scrollLimit?: number;
  totalScrollToday?: number;
  lastHealthUpdate?: string;
  lastScrollDate?: string;
  usageBaselineMinutes?: number;
  usageBaselineDate?: string;
  lastNotifiedBand?: NotifyBand;
  lastNotifiedHealth?: number;
};

const NEAR_DEATH_HP = 15;
const SICKER_DROP = 15;

export async function processPetNotifications(input: {
  petName: string;
  prevHealth: number;
  nextHealth: number;
  minutes: number;
  scrollLimit: number;
  lastNotifiedBand?: NotifyBand;
  lastNotifiedHealth?: number;
}): Promise<{ lastNotifiedBand: NotifyBand; lastNotifiedHealth: number }> {
  const {
    petName,
    prevHealth,
    nextHealth,
    minutes,
    scrollLimit,
    lastNotifiedBand,
    lastNotifiedHealth,
  } = input;

  let band: NotifyBand = lastNotifiedBand ?? 'healthy';
  let notifiedHealth = lastNotifiedHealth ?? prevHealth;
  const overLimit = minutes > scrollLimit;

  if (nextHealth <= 0) {
    if (band !== 'dead') {
      await notifyPetDead(petName);
      band = 'dead';
      notifiedHealth = 0;
    }
    return { lastNotifiedBand: band, lastNotifiedHealth: notifiedHealth };
  }

  if (nextHealth <= NEAR_DEATH_HP) {
    if (band !== 'near_death' && band !== 'dead') {
      await notifyPetNearDeath(petName, nextHealth);
      band = 'near_death';
      notifiedHealth = nextHealth;
    }
    return { lastNotifiedBand: band, lastNotifiedHealth: notifiedHealth };
  }

  if (nextHealth < 50) {
    if (band === 'healthy' || band === 'full' || band === 'over' || !lastNotifiedBand) {
      await notifyPetSick(petName);
      band = 'sick';
      notifiedHealth = nextHealth;
    } else if (
      (band === 'sick' || band === 'sicker' || band === 'near_death') &&
      notifiedHealth - nextHealth >= SICKER_DROP
    ) {
      await notifyPetGettingSicker(petName, nextHealth);
      band = 'sicker';
      notifiedHealth = nextHealth;
    }
    return { lastNotifiedBand: band, lastNotifiedHealth: notifiedHealth };
  }

  if (nextHealth >= 100) {
    if (band !== 'full') {
      await notifyPetFull(petName);
      band = 'full';
      notifiedHealth = 100;
    }
    return { lastNotifiedBand: band, lastNotifiedHealth: notifiedHealth };
  }

  if (overLimit && band !== 'over') {
    await notifyOverLimit(petName, minutes, scrollLimit);
    band = 'over';
    notifiedHealth = nextHealth;
    return { lastNotifiedBand: band, lastNotifiedHealth: notifiedHealth };
  }

  if (band === 'sick' || band === 'sicker' || band === 'near_death' || band === 'dead') {
    band = 'healthy';
    notifiedHealth = nextHealth;
  }

  return { lastNotifiedBand: band, lastNotifiedHealth: notifiedHealth };
}

TaskManager.defineTask(BACKGROUND_HEALTH_TASK, async () => {
  try {
    const user = auth.currentUser;
    if (!user) return BackgroundFetch.BackgroundFetchResult.NoData;

    const granted = await hasUsagePermission();
    if (!granted) return BackgroundFetch.BackgroundFetchResult.NoData;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data()?.pet) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const raw = userDoc.data().pet as PetData;
    const petName = raw.name || 'Your pet';
    const trackedPackages = resolveTrackedPackages(
      userDoc.data()?.trackedAppIds ?? null
    );

    if ((raw.health ?? 100) <= 0) {
      if (raw.lastNotifiedBand !== 'dead') {
        await notifyPetDead(petName);
        await setDoc(
          userRef,
          { pet: { ...raw, lastNotifiedBand: 'dead', lastNotifiedHealth: 0 } },
          { merge: true }
        );
      }
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const result = await getPetScrollMinutes(
      raw.usageBaselineMinutes ?? 0,
      raw.usageBaselineDate ?? '',
      raw.createdAt,
      trackedPackages
    );

    const prev: PetHealthState = {
      health: raw.health ?? 100,
      happiness: raw.happiness ?? 100,
      scrollLimit: raw.scrollLimit ?? 45,
      totalScrollToday: raw.totalScrollToday ?? 0,
      lastHealthUpdate: raw.lastHealthUpdate ?? new Date().toISOString(),
      lastScrollDate: raw.lastScrollDate ?? getUTCDateKey(),
    };

    const next = applyHealthTick(prev, result.minutes);

    const notify = await processPetNotifications({
      petName,
      prevHealth: prev.health,
      nextHealth: next.health,
      minutes: result.minutes,
      scrollLimit: next.scrollLimit,
      lastNotifiedBand: raw.lastNotifiedBand,
      lastNotifiedHealth: raw.lastNotifiedHealth,
    });

    const todayKey = getUTCDateKey();
    const existingHistory: Record<string, number> =
      userDoc.data()?.usageHistory ?? {};

    let updatedHistory: Record<string, number> = {
      ...existingHistory,
      [todayKey]: result.minutes,
    };

    const sortedKeys = Object.keys(updatedHistory).sort();
    if (sortedKeys.length > 90) {
      const keep = sortedKeys.slice(-90);
      const trimmed: Record<string, number> = {};
      keep.forEach((k) => {
        trimmed[k] = updatedHistory[k];
      });
      updatedHistory = trimmed;
    }

    await setDoc(
      userRef,
      {
        pet: {
          ...raw,
          ...next,
          usageBaselineMinutes: result.newBaseline,
          usageBaselineDate: result.newBaselineDate,
          lastNotifiedBand: notify.lastNotifiedBand,
          lastNotifiedHealth: notify.lastNotifiedHealth,
        },
        usageHistory: updatedHistory,
      },
      { merge: true }
    );

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log('Background health task failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundHealthTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_HEALTH_TASK
    );
    if (isRegistered) return;

    await BackgroundFetch.registerTaskAsync(BACKGROUND_HEALTH_TASK, {
      minimumInterval: 15 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (error) {
    console.log('Failed to register background task:', error);
  }
}

export async function unregisterBackgroundHealthTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_HEALTH_TASK
    );
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_HEALTH_TASK);
    }
  } catch (error) {
    console.log('Failed to unregister background task:', error);
  }
}
