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
}

export const REACTION_OPTIONS = [
  { id: 'relaxed', label: 'Relaxed', description: '3 seconds to reel in' },
  { id: 'standard', label: 'Standard', description: '1.9 seconds to reel in' },
  { id: 'quick', label: 'Quick', description: '1.3 seconds to reel in' },
]
