// LocalStorage utilities for tracking viewed round results

interface ViewedRound {
  viewed: boolean;
  viewedAt: number;
}

interface ViewedRounds {
  [chainId: string]: {
    [roundId: string]: ViewedRound;
  };
}

const STORAGE_KEY = 'gm_lottery_viewed_rounds';

export function getViewedRounds(): ViewedRounds {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading viewed rounds:', error);
    return {};
  }
}

export function isRoundViewed(chainId: number, roundId: number): boolean {
  const viewedRounds = getViewedRounds();
  return viewedRounds[chainId]?.[roundId]?.viewed || false;
}

export function markRoundAsViewed(chainId: number, roundId: number): void {
  if (typeof window === 'undefined') return;

  const viewedRounds = getViewedRounds();

  if (!viewedRounds[chainId]) {
    viewedRounds[chainId] = {};
  }

  viewedRounds[chainId][roundId] = {
    viewed: true,
    viewedAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedRounds));
  } catch (error) {
    console.error('Error saving viewed round:', error);
  }
}

export function clearOldViewedRounds(daysOld: number = 30): void {
  if (typeof window === 'undefined') return;

  const viewedRounds = getViewedRounds();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

  for (const chainId in viewedRounds) {
    for (const roundId in viewedRounds[chainId]) {
      const viewedRound = viewedRounds[chainId][roundId];
      if (viewedRound.viewedAt < cutoffTime) {
        delete viewedRounds[chainId][roundId];
      }
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedRounds));
  } catch (error) {
    console.error('Error clearing old viewed rounds:', error);
  }
}
