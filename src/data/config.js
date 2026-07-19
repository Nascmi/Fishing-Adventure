export const GAME_CONFIG = {
  startingCoins: 50,
  castingMs: 650,
  waitMinMs: 2000,
  waitMaxMs: 5000,
  reactionWindows: {
    relaxed: 3000,
    standard: 1900,
    quick: 1300,
  },
  resetDelayMs: 1500,
  dayCycle: {
    phaseMs: 15 * 60 * 1000,
    tripDays: 3,
    phases: [
      { id: 'morning', label: 'Morning', time: '6 AM' },
      { id: 'midday', label: 'Midday', time: 'Noon' },
      { id: 'evening', label: 'Evening', time: '6 PM' },
      { id: 'night', label: 'Night', time: 'Midnight' },
    ],
  },
  reeling: {
    startingTension: 34,
    startingProgress: 12,
    tensionRisePerSecond: 25,
    tensionRecoveryPerSecond: 31,
    progressPerSecond: 29,
    progressLossPerSecond: 4,
    safeTensionMin: 22,
    safeTensionMax: 84,
    rarityDifficulty: {
      common: 0.82,
      uncommon: 0.94,
      rare: 1.06,
      epic: 1.18,
      legendary: 1.3,
    },
  },
  catchWeights: [
    { id: 'ordinary', label: 'Regular catch', chance: 68, minPercent: 0, maxPercent: 0.5 },
    { id: 'good', label: 'Good catch', chance: 22, minPercent: 0.51, maxPercent: 0.75 },
    { id: 'trophy', label: 'Trophy catch', chance: 8, minPercent: 0.76, maxPercent: 0.9 },
    { id: 'amazing', label: 'Amazing catch', chance: 2, minPercent: 0.91, maxPercent: 1 },
  ],
}

export const REACTION_OPTIONS = [
  { id: 'relaxed', label: 'Relaxed', description: '3 seconds to reel in' },
  { id: 'standard', label: 'Standard', description: '1.9 seconds to reel in' },
  { id: 'quick', label: 'Quick', description: '1.3 seconds to reel in' },
]
