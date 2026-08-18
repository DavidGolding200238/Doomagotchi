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

// mock minutes
export function applyHealthTick(
  prev: PetHealthState,
  scrollMinutesToday: number,
  now = new Date()
): PetHealthState {
  const today = now.toISOString().slice(0, 10);

  let health = prev.health ?? 100;
  let happiness = prev.happiness ?? 100;
  const scrollLimit = prev.scrollLimit || DEFAULT_LIMIT;

  // New day small recovery
  if (prev.lastScrollDate !== today) {
    health = clamp(health + 5);
    happiness = clamp(happiness + 5);
  }

  const over = Math.max(0, scrollMinutesToday - scrollLimit);
  const under = Math.max(0, scrollLimit - scrollMinutesToday);

  if (over > 0) {
    health = clamp(health - over / 3); // 1 HP per 3 min over
    happiness = clamp(happiness - over / 4);
  } else {
    health = clamp(health + under / 30);
    happiness = clamp(happiness + under / 25);
  }

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