import * as UsageStats from 'expo-android-usagestats';

export const SOCIAL_PACKAGES = [
  'com.instagram.android',
  'com.zhiliaoapp.musically',
  'com.ss.android.ugc.trill',
  'com.twitter.android',
  'com.google.android.youtube',
  'com.facebook.katana',
  'com.facebook.orca',
  'com.reddit.frontpage',
  'com.snapchat.android',
];

/** Instagram + TikTok only (No Reels Night) */
export const REELS_PACKAGES = [
  'com.instagram.android',
  'com.zhiliaoapp.musically',
  'com.ss.android.ugc.trill',
];

const APP_NAMES: Record<string, string> = {
  'com.instagram.android': 'Instagram',
  'com.zhiliaoapp.musically': 'TikTok',
  'com.ss.android.ugc.trill': 'TikTok',
  'com.twitter.android': 'X',
  'com.google.android.youtube': 'YouTube',
  'com.facebook.katana': 'Facebook',
  'com.facebook.orca': 'Messenger',
  'com.reddit.frontpage': 'Reddit',
  'com.snapchat.android': 'Snapchat',
};

/** UTC key for usageHistory (graphs) */
export function getUTCDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Local calendar key YYYY-MM-DD */
export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function startOfLocalDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfLocalDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export async function hasUsagePermission(): Promise<boolean> {
  try {
    const has = await UsageStats.hasUsageStatsPermission();
    if (has) return true;

    const now = Date.now();
    await UsageStats.getUsageStats(now - 60_000, now);
    return true;
  } catch {
    return false;
  }
}

export async function requestUsagePermission(): Promise<void> {
  await UsageStats.requestUsageStatsPermission();
}

/** Minutes for package list between two timestamps */
export async function getMinutesInRange(
  startMs: number,
  endMs: number,
  packages: string[] = SOCIAL_PACKAGES
): Promise<number> {
  if (endMs <= startMs) return 0;

  const stats = await UsageStats.getUsageStats(startMs, endMs);
  let totalMs = 0;

  for (const app of stats) {
    if (packages.includes(app.packageName)) {
      totalMs += app.totalTimeInForeground || 0;
    }
  }

  return Math.round(totalMs / 1000 / 60);
}

/** Raw total minutes spent in social apps today (UTC midnight — used for history/graphs) */
export async function getRawTodaySocialMinutes(): Promise<number> {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  return getMinutesInRange(startOfDay.getTime(), now, SOCIAL_PACKAGES);
}

export async function getPetScrollMinutes(
  baselineMinutes: number,
  baselineDate: string,
  petCreatedAt?: string
): Promise<{ minutes: number; newBaseline: number; newBaselineDate: string }> {
  const today = getUTCDateKey();
  const raw = await getRawTodaySocialMinutes();

  const createdDate = petCreatedAt ? petCreatedAt.slice(0, 10) : null;
  const isCreationDay = createdDate === today;

  if (isCreationDay) {
    if (baselineDate !== today) {
      return {
        minutes: 0,
        newBaseline: raw,
        newBaselineDate: today,
      };
    }

    return {
      minutes: Math.max(0, raw - baselineMinutes),
      newBaseline: baselineMinutes,
      newBaselineDate: baselineDate,
    };
  }

  return {
    minutes: raw,
    newBaseline: 0,
    newBaselineDate: today,
  };
}

export async function getTopEnemyApp(): Promise<string> {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const stats = await UsageStats.getUsageStats(startOfDay.getTime(), now);

  let topPackage = '';
  let topTime = 0;

  for (const app of stats) {
    if (APP_NAMES[app.packageName]) {
      const minutes = Math.round((app.totalTimeInForeground || 0) / 1000 / 60);
      if (minutes > topTime) {
        topTime = minutes;
        topPackage = app.packageName;
      }
    }
  }

  if (!topPackage || topTime === 0) return '—';
  return APP_NAMES[topPackage];
}