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

/** Matches SettingsModal TRACKABLE_APPS ids → package names */
export const TRACKABLE_APP_DEFS: { id: string; packages: string[] }[] = [
  { id: 'instagram', packages: ['com.instagram.android'] },
  { id: 'tiktok', packages: ['com.zhiliaoapp.musically', 'com.ss.android.ugc.trill'] },
  { id: 'x', packages: ['com.twitter.android'] },
  { id: 'youtube', packages: ['com.google.android.youtube'] },
  { id: 'facebook', packages: ['com.facebook.katana'] },
  { id: 'messenger', packages: ['com.facebook.orca'] },
  { id: 'reddit', packages: ['com.reddit.frontpage'] },
  { id: 'snapchat', packages: ['com.snapchat.android'] },
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

/**
 * Convert Settings `trackedAppIds` into package names for UsageStats.
 * - null / undefined → all apps (never configured yet)
 * - [] → nothing tracked (user turned everything off)
 * - ['instagram', ...] → only those apps
 */
export function resolveTrackedPackages(
  trackedAppIds?: string[] | null
): string[] {
  if (trackedAppIds == null) {
    return [...SOCIAL_PACKAGES];
  }
  if (trackedAppIds.length === 0) {
    return [];
  }
  const idSet = new Set(trackedAppIds);
  const packages: string[] = [];
  for (const app of TRACKABLE_APP_DEFS) {
    if (idSet.has(app.id)) {
      packages.push(...app.packages);
    }
  }
  return packages;
}

/** Reels packages limited to whatever the user still tracks */
export function resolveReelsPackages(trackedPackages: string[]): string[] {
  const set = new Set(trackedPackages);
  return REELS_PACKAGES.filter((p) => set.has(p));
}

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
  if (packages.length === 0) return 0;

  const stats = await UsageStats.getUsageStats(startMs, endMs);
  let totalMs = 0;

  for (const app of stats) {
    if (packages.includes(app.packageName)) {
      totalMs += app.totalTimeInForeground || 0;
    }
  }

  return Math.round(totalMs / 1000 / 60);
}

/** Raw total minutes spent in tracked social apps today (UTC midnight) */
export async function getRawTodaySocialMinutes(
  packages: string[] = SOCIAL_PACKAGES
): Promise<number> {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  return getMinutesInRange(startOfDay.getTime(), now, packages);
}

export async function getPetScrollMinutes(
  baselineMinutes: number,
  baselineDate: string,
  petCreatedAt?: string,
  packages: string[] = SOCIAL_PACKAGES
): Promise<{ minutes: number; newBaseline: number; newBaselineDate: string }> {
  const today = getUTCDateKey();
  const raw = await getRawTodaySocialMinutes(packages);

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

export async function getTopEnemyApp(
  packages: string[] = SOCIAL_PACKAGES
): Promise<string> {
  if (packages.length === 0) return '—';

  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const stats = await UsageStats.getUsageStats(startOfDay.getTime(), now);

  let topPackage = '';
  let topTime = 0;

  for (const app of stats) {
    if (packages.includes(app.packageName) && APP_NAMES[app.packageName]) {
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
