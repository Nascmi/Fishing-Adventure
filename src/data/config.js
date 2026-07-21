import { RARITY_REELING_DIFFICULTY } from './rarities'

export const GAME_CONFIG = {
  startingCoins: 50,
  trophyPreservationCost: 100,
  castingMs: 650,
  waitMinMs: 2500,
  waitMaxMs: 10000,
  reactionWindows: {
    relaxed: 3000,
    standard: 1900,
    quick: 1300,
  },
  resetDelayMs: 1500,
  weather: {
    minRainIntervalMs: 3 * 4 * 15 * 60 * 1000,
    maxRainIntervalMs: 4 * 4 * 15 * 60 * 1000,
    minRainDurationMs: 3 * 60 * 1000,
    maxRainDurationMs: 5 * 60 * 1000,
  },
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
    redZoneProgressMultiplier: 0.45,
    slackProgressLossMultiplier: 2.5,
    lineStrainPerSecond: 30,
    lineStrainRecoveryPerSecond: 18,
    safeTensionMin: 22,
    safeTensionMax: 70,
    rarityDifficulty: RARITY_REELING_DIFFICULTY,
  },
  catchWeights: [
    { id: 'ordinary', label: 'Regular catch', chance: 68, minPercent: 0, maxPercent: 0.5 },
    { id: 'good', label: 'Good catch', chance: 22, minPercent: 0.51, maxPercent: 0.75 },
    { id: 'great', label: 'Great catch', chance: 8, minPercent: 0.76, maxPercent: 0.9 },
    { id: 'trophy', label: 'Trophy catch', chance: 2, minPercent: 0.91, maxPercent: 1 },
  ],
}

export const REACTION_OPTIONS = [
  { id: 'relaxed', label: 'Relaxed', description: '3 seconds to reel in' },
  { id: 'standard', label: 'Standard', description: '1.9 seconds to reel in' },
  { id: 'quick', label: 'Quick', description: '1.3 seconds to reel in' },
]
