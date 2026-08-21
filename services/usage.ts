import * as UsageStats from 'expo-android-usagestats';

const SOCIAL_PACKAGES = [
  'com.instagram.android',
  'com.zhiliaoapp.musically', // TikTok
  'com.ss.android.ugc.trill', // TikTok (some regions)
  'com.twitter.android',
  'com.google.android.youtube',
  'com.facebook.katana',
  'com.facebook.orca',
  'com.reddit.frontpage',
  'com.snapchat.android',
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

/** Always returns YYYY-MM-DD in UTC to avoid timezone edge cases */
export function getUTCDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export async function checkAndRequestUsagePermission(): Promise<boolean> {
  const hasPermission = await UsageStats.hasUsageStatsPermission();

  if (!hasPermission) {
    await UsageStats.requestUsageStatsPermission();
    return false;
  }

  return true;
}

/** Raw total minutes spent in social apps today (from midnight UTC) */
export async function getRawTodaySocialMinutes(): Promise<number> {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const stats = await UsageStats.getUsageStats(startOfDay.getTime(), now);

  let totalMs = 0;
  for (const app of stats) {
    if (SOCIAL_PACKAGES.includes(app.packageName)) {
      totalMs += app.totalTimeInForeground || 0;
    }
  }

  return Math.round(totalMs / 1000 / 60);
}

/**
 * Returns the minutes that should count for the pet today.
 *
 * - On the day the pet was created → baseline protection
 * - Every day after that → full usage from midnight UTC counts
 */
export async function getPetScrollMinutes(
  baselineMinutes: number,
  baselineDate: string,
  petCreatedAt?: string
): Promise<{ minutes: number; newBaseline: number; newBaselineDate: string }> {
  const today = getUTCDateKey();
  const raw = await getRawTodaySocialMinutes();

  const createdDate = petCreatedAt ? petCreatedAt.slice(0, 10) : null;
  const isCreationDay = createdDate === today;

  // ── First day the pet exists → keep the original protection ──
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

  // ── Any day after creation → full usage counts ──
  return {
    minutes: raw,
    newBaseline: 0,
    newBaselineDate: today,
  };
}

/** Returns the name of the social app used the most today */
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