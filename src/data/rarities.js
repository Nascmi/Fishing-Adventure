export const RARITIES = [
  { id: 'common', label: 'Common', valueMultiplier: 1, reelingDifficulty: 0.82 },
  { id: 'uncommon', label: 'Uncommon', valueMultiplier: 1.25, reelingDifficulty: 0.94 },
  { id: 'rare', label: 'Rare', valueMultiplier: 1.7, reelingDifficulty: 1.06 },
  { id: 'epic', label: 'Epic', valueMultiplier: 2.4, reelingDifficulty: 1.18 },
  { id: 'legendary', label: 'Legendary', valueMultiplier: 4, reelingDifficulty: 1.3 },
]

export const RARITY_ORDER = RARITIES.map((rarity) => rarity.id)
export const RARITY_VALUE_MULTIPLIERS = Object.fromEntries(RARITIES.map((rarity) => [rarity.id, rarity.valueMultiplier]))
export const RARITY_REELING_DIFFICULTY = Object.fromEntries(RARITIES.map((rarity) => [rarity.id, rarity.reelingDifficulty]))

export const getRarity = (id) => RARITIES.find((rarity) => rarity.id === id)
