import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/services/firebase';
import { applyHealthTick, type PetHealthState } from '@/services/health';
import {
    notifyOverLimit,
    notifyPetDead,
    notifyPetSick,
} from '@/services/notifications';
import {
    getPetScrollMinutes,
    getUTCDateKey,
    hasUsagePermission,
} from '@/services/usage';

export const BACKGROUND_HEALTH_TASK = 'doomagotchi-health-tick';

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
  lastNotifiedBand?: 'healthy' | 'sick' | 'dead' | 'over';
};

function getBand(health: number): 'healthy' | 'sick' | 'dead' {
  if (health <= 0) return 'dead';
  if (health < 50) return 'sick';
  return 'healthy';
}

TaskManager.defineTask(BACKGROUND_HEALTH_TASK, async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const granted = await hasUsagePermission();
    if (!granted) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data()?.pet) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const raw = userDoc.data().pet as PetData;
    const petName = raw.name || 'Your pet';

    // Already dead — only notify once
    if ((raw.health ?? 100) <= 0) {
      if (raw.lastNotifiedBand !== 'dead') {
        await notifyPetDead(petName);
        await setDoc(
          userRef,
          { pet: { ...raw, lastNotifiedBand: 'dead' } },
          { merge: true }
        );
      }
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const result = await getPetScrollMinutes(
      raw.usageBaselineMinutes ?? 0,
      raw.usageBaselineDate ?? '',
      raw.createdAt
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
    const prevBand = getBand(prev.health);
    const nextBand = getBand(next.health);
    const overLimit = result.minutes > next.scrollLimit;

    let lastNotifiedBand = raw.lastNotifiedBand ?? prevBand;

    // Notify only on band change / first time over limit
    if (nextBand === 'dead' && lastNotifiedBand !== 'dead') {
      await notifyPetDead(petName);
      lastNotifiedBand = 'dead';
    } else if (nextBand === 'sick' && lastNotifiedBand === 'healthy') {
      await notifyPetSick(petName);
      lastNotifiedBand = 'sick';
    } else if (overLimit && lastNotifiedBand !== 'over' && nextBand === 'healthy') {
      await notifyOverLimit(petName, result.minutes, next.scrollLimit);
      lastNotifiedBand = 'over';
    }

    // Keep usage history in sync (same as Home)
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
          lastNotifiedBand,
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
      minimumInterval: 15 * 60, // Android minimum is effectively ~15 min
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