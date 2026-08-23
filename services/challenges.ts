import {
    getMinutesInRange,
    REELS_PACKAGES,
    SOCIAL_PACKAGES,
} from '@/services/usage';

export type ChallengeStatus = 'locked' | 'available' | 'completed';

export type ChallengeDef = {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'streak' | 'milestone';
  goal: string;
  xp: number;
};

export type ChallengeView = ChallengeDef & {
  status: ChallengeStatus;
};

export type ChallengeState = {
  completedIds: string[];
  lastEvaluatedAt?: string;
};

export const CHALLENGE_DEFS: ChallengeDef[] = [
  {
    id: '1',
    name: 'First Light',
    description: 'Stay under your scroll limit for 1 full day',
    type: 'daily',
    goal: '1 healthy day',
    xp: 40,
  },
  {
    id: '2',
    name: 'No Reels Night',
    description: 'Zero Instagram / TikTok between 21:00 – 07:00 UTC',
    type: 'daily',
    goal: 'Clean night',
    xp: 50,
  },
  {
    id: '3',
    name: 'Two-Day Streak',
    description: 'Keep your pet healthy for 2 consecutive days',
    type: 'streak',
    goal: '2 day streak',
    xp: 80,
  },
  {
    id: '4',
    name: 'Scroll Fast',
    description: 'Stay under 50% of your daily limit',
    type: 'daily',
    goal: 'Under 50%',
    xp: 60,
  },
  {
    id: '5',
    name: 'Three-Day Streak',
    description: '3 consecutive healthy days',
    type: 'streak',
    goal: '3 day streak',
    xp: 120,
  },
  {
    id: '6',
    name: 'Morning Mute',
    description: 'No social apps before 10:00 UTC',
    type: 'daily',
    goal: 'Clean morning',
    xp: 45,
  },
  {
    id: '7',
    name: 'Five-Day Guardian',
    description: '5 consecutive days under limit',
    type: 'streak',
    goal: '5 day streak',
    xp: 180,
  },
  {
    id: '8',
    name: 'Weekend Warrior',
    description: 'Both Saturday and Sunday under limit (UTC)',
    type: 'streak',
    goal: 'Full weekend',
    xp: 100,
  },
  {
    id: '9',
    name: 'Week of Focus',
    description: '7 consecutive healthy days',
    type: 'streak',
    goal: '7 day streak',
    xp: 250,
  },
  {
    id: '10',
    name: 'Pet Protector',
    description: 'Keep the same pet alive for 14 days total',
    type: 'milestone',
    goal: '14 days alive',
    xp: 400,
  },
];

// ─────────────────────────────────────────────
// UTC day helpers
// ─────────────────────────────────────────────

function startOfUTCDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfUTCDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

function sameUTCDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function addUTCDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function daysAliveUTC(createdAt: string, now: Date): number {
  const created = new Date(createdAt);
  const start = startOfUTCDay(created);
  const end = startOfUTCDay(now);
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000)) + 1;
}

/**
 * Returns true only if the day is fully finished,
 * is on or after the pet was created,
 * and the usage that day was under the limit.
 */
async function isHealthyFinishedDay(
  day: Date,
  scrollLimit: number,
  createdAt: string,
  now: Date
): Promise<boolean> {
  const dayStart = startOfUTCDay(day);
  const dayEnd = endOfUTCDay(day);
  const petCreated = startOfUTCDay(new Date(createdAt));

  // Day must be fully over
  if (dayEnd.getTime() > now.getTime()) return false;

  // Ignore any day before the pet existed
  if (dayStart.getTime() < petCreated.getTime()) return false;

  // Creation day itself never counts
  if (sameUTCDay(dayStart, petCreated)) return false;

  const minutes = await getMinutesInRange(
    dayStart.getTime(),
    dayEnd.getTime(),
    SOCIAL_PACKAGES
  );
  return minutes <= scrollLimit;
}

async function hasConsecutiveHealthyDays(
  count: number,
  scrollLimit: number,
  createdAt: string,
  now: Date
): Promise<boolean> {
  // Ending at yesterday (last finished UTC day)
  for (let i = 1; i <= count; i++) {
    const day = addUTCDays(startOfUTCDay(now), -i);
    const ok = await isHealthyFinishedDay(day, scrollLimit, createdAt, now);
    if (!ok) return false;
  }
  return true;
}

/** Most recently fully finished weekend (Sat+Sun both in the past, UTC) */
function lastFinishedWeekend(now: Date): { sat: Date; sun: Date } | null {
  const today = startOfUTCDay(now);
  const dow = today.getUTCDay(); // 0 Sun ... 6 Sat

  // Days since last Sunday
  const daysSinceSunday = dow === 0 ? 7 : dow;
  const lastSunday = addUTCDays(today, -daysSinceSunday);
  const lastSaturday = addUTCDays(lastSunday, -1);

  // Both must be finished
  if (endOfUTCDay(lastSunday).getTime() > now.getTime()) return null;

  return { sat: lastSaturday, sun: lastSunday };
}

async function checkNoReelsNight(
  now: Date,
  createdAt: string
): Promise<boolean> {
  // Only after 07:00 UTC so the window is complete
  if (now.getUTCHours() < 7) return false;

  const todayStart = startOfUTCDay(now);
  const petCreated = startOfUTCDay(new Date(createdAt));

  const windowStart = new Date(todayStart);
  windowStart.setUTCDate(windowStart.getUTCDate() - 1);
  windowStart.setUTCHours(21, 0, 0, 0);

  const windowEnd = new Date(todayStart);
  windowEnd.setUTCHours(7, 0, 0, 0);

  if (windowEnd.getTime() > now.getTime()) return false;

  // Window must be fully after the pet was created
  if (windowStart.getTime() < petCreated.getTime()) return false;

  const minutes = await getMinutesInRange(
    windowStart.getTime(),
    windowEnd.getTime(),
    REELS_PACKAGES
  );
  return minutes === 0;
}

async function checkMorningMute(
  now: Date,
  createdAt: string
): Promise<boolean> {
  // Evaluate yesterday's morning (always a finished window)
  const yesterday = addUTCDays(startOfUTCDay(now), -1);
  const petCreated = startOfUTCDay(new Date(createdAt));

  // Yesterday must be on or after pet creation
  if (startOfUTCDay(yesterday).getTime() < petCreated.getTime()) return false;

  const windowStart = new Date(yesterday);
  windowStart.setUTCHours(0, 0, 0, 0);

  const windowEnd = new Date(yesterday);
  windowEnd.setUTCHours(10, 0, 0, 0);

  const minutes = await getMinutesInRange(
    windowStart.getTime(),
    windowEnd.getTime(),
    SOCIAL_PACKAGES
  );
  return minutes === 0;
}

async function canComplete(
  id: string,
  ctx: {
    scrollLimit: number;
    createdAt: string;
    health: number;
    now: Date;
  }
): Promise<boolean> {
  const { scrollLimit, createdAt, health, now } = ctx;

  switch (id) {
    case '1': {
      const yesterday = addUTCDays(startOfUTCDay(now), -1);
      return isHealthyFinishedDay(yesterday, scrollLimit, createdAt, now);
    }
    case '2':
      return checkNoReelsNight(now, createdAt);
    case '3':
      return hasConsecutiveHealthyDays(2, scrollLimit, createdAt, now);
    case '4': {
      const yesterday = addUTCDays(startOfUTCDay(now), -1);
      return isHealthyFinishedDay(yesterday, scrollLimit * 0.5, createdAt, now);
    }
    case '5':
      return hasConsecutiveHealthyDays(3, scrollLimit, createdAt, now);
    case '6':
      return checkMorningMute(now, createdAt);
    case '7':
      return hasConsecutiveHealthyDays(5, scrollLimit, createdAt, now);
    case '8': {
      const weekend = lastFinishedWeekend(now);
      if (!weekend) return false;
      const satOk = await isHealthyFinishedDay(
        weekend.sat,
        scrollLimit,
        createdAt,
        now
      );
      const sunOk = await isHealthyFinishedDay(
        weekend.sun,
        scrollLimit,
        createdAt,
        now
      );
      return satOk && sunOk;
    }
    case '9':
      return hasConsecutiveHealthyDays(7, scrollLimit, createdAt, now);
    case '10':
      return health > 0 && daysAliveUTC(createdAt, now) >= 14;
    default:
      return false;
  }
}

/**
 * Sequential evaluation:
 * - already completed stay completed
 * - only the first non-completed challenge can newly complete
 * - everything after stays locked until previous is done
 */
export async function evaluateChallenges(input: {
  existing: ChallengeState | undefined;
  scrollLimit: number;
  createdAt: string;
  health: number;
  now?: Date;
}): Promise<ChallengeState> {
  const now = input.now ?? new Date();
  const completed = new Set(input.existing?.completedIds ?? []);

  for (const def of CHALLENGE_DEFS) {
    if (completed.has(def.id)) continue;

    // Must have all previous completed (sequential)
    const index = CHALLENGE_DEFS.findIndex((c) => c.id === def.id);
    const prev = CHALLENGE_DEFS.slice(0, index);
    const prevDone = prev.every((c) => completed.has(c.id));
    if (!prevDone) break;

    const ok = await canComplete(def.id, {
      scrollLimit: input.scrollLimit,
      createdAt: input.createdAt,
      health: input.health,
      now,
    });

    if (ok) {
      completed.add(def.id);
      // keep going so multiple can complete in one open if earned
      continue;
    }

    // Current available one not met yet — stop
    break;
  }

  return {
    completedIds: CHALLENGE_DEFS.map((c) => c.id).filter((id) =>
      completed.has(id)
    ),
    lastEvaluatedAt: now.toISOString(),
  };
}

export function buildChallengeViews(
  state: ChallengeState | undefined
): ChallengeView[] {
  const completed = new Set(state?.completedIds ?? []);

  return CHALLENGE_DEFS.map((def, index) => {
    if (completed.has(def.id)) {
      return { ...def, status: 'completed' };
    }

    const prev = CHALLENGE_DEFS.slice(0, index);
    const unlocked = prev.every((c) => completed.has(c.id));

    return {
      ...def,
      status: unlocked ? 'available' : 'locked',
    };
  });
}

export function badgeUnlockCount(completedCount: number): number {
  if (completedCount >= 10) return 4;
  if (completedCount >= 6) return 3;
  if (completedCount >= 4) return 2;
  if (completedCount >= 2) return 1;
  return 0;
}

export function emptyChallengeState(): ChallengeState {
  return { completedIds: [] };
}