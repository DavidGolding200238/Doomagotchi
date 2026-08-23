export type PetHealthState = {
  health: number;
  happiness: number;
  scrollLimit: number;
  totalScrollToday: number;
  lastHealthUpdate: string;
  lastScrollDate: string;
};

const DEFAULT_LIMIT = 45;

export function createDefaultHealth(): PetHealthState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    health: 100,
    happiness: 100,
    scrollLimit: DEFAULT_LIMIT,
    totalScrollToday: 0,
    lastHealthUpdate: new Date().toISOString(),
    lastScrollDate: today,
  };
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/**
 * Apply health/happiness changes based on current social-app minutes.
 *

 * This prevents the pet from losing health every time the screen is refreshed.
 */
export function applyHealthTick(
  prev: PetHealthState,
  scrollMinutesToday: number,
  now = new Date()
): PetHealthState {
  const today = now.toISOString().slice(0, 10);

  let health = prev.health ?? 100;
  let happiness = prev.happiness ?? 100;
  const scrollLimit = prev.scrollLimit || DEFAULT_LIMIT;

  // Once dead, stay dead — no recovery
  if (health <= 0) {
    return {
      health: 0,
      happiness: Math.min(happiness, 10),
      scrollLimit,
      totalScrollToday: scrollMinutesToday,
      lastHealthUpdate: now.toISOString(),
      lastScrollDate: today,
    };
  }

  // New calendar day  small recovery, then treat previous minutes as 0
  const isNewDay = prev.lastScrollDate !== today;
  if (isNewDay) {
    health = clamp(health + 5);
    happiness = clamp(happiness + 5);
  }

  // Minutes that were already accounted for in the previous tick
  const prevMinutes =
    isNewDay ? 0 : (prev.totalScrollToday ?? 0);

  const prevOver = Math.max(0, prevMinutes - scrollLimit);
  const currOver = Math.max(0, scrollMinutesToday - scrollLimit);

  // Only the *new* overage causes damage
  const newOverMinutes = Math.max(0, currOver - prevOver);

  if (newOverMinutes > 0) {
    // 1 HP per 3 minutes over the limit (only the extra minutes)
    health = clamp(health - newOverMinutes / 3);
    happiness = clamp(happiness - newOverMinutes / 4);
  } else if (currOver === 0) {
    // Currently under the limit.
    // Give a very small recovery so rapid refreshes cannot stack it.
    // (Original under/30 formula was also total and suffered the same stacking bug.)
    const minutesSinceLastUpdate =
      (now.getTime() - new Date(prev.lastHealthUpdate).getTime()) / 60_000;

    // At most +1 health / +1 happiness every ~8–10 minutes while under the limit
    if (minutesSinceLastUpdate >= 8) {
      health = clamp(health + 1);
      happiness = clamp(happiness + 1);
    }
  }
  // If still over the limit but no *new* overage, do nothing (no extra damage)

  return {
    health,
    happiness,
    scrollLimit,
    totalScrollToday: scrollMinutesToday,
    lastHealthUpdate: now.toISOString(),
    lastScrollDate: today,
  };
}

export function isPetDead(health: number) {
  return health <= 0;
}