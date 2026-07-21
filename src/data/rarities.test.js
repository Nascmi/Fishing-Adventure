import { describe, expect, it } from 'vitest'
import { GAME_CONFIG } from './config'
import { fish } from './fish'
import { RARITIES, RARITY_ORDER, RARITY_REELING_DIFFICULTY, RARITY_VALUE_MULTIPLIERS } from './rarities'
import { rods } from './rods'

describe('rarity catalog', () => {
  it('defines every rarity once in progression order', () => {
    expect(RARITY_ORDER).toEqual(['common', 'uncommon', 'rare', 'epic', 'legendary'])
    expect(new Set(RARITY_ORDER).size).toBe(RARITIES.length)
    expect(Object.keys(RARITY_VALUE_MULTIPLIERS)).toEqual(RARITY_ORDER)
    expect(Object.keys(RARITY_REELING_DIFFICULTY)).toEqual(RARITY_ORDER)
  })

  it('covers every fish and every rod chance table', () => {
    const validRarities = new Set(RARITY_ORDER)
    expect(fish.every((item) => validRarities.has(item.rarity))).toBe(true)
    expect(rods.every((rod) => Object.keys(rod.chances).every((rarity) => validRarities.has(rarity)))).toBe(true)
    expect(rods.every((rod) => RARITY_ORDER.every((rarity) => rarity in rod.chances))).toBe(true)
  })

  it('supplies the reeling configuration from the canonical catalog', () => {
    expect(GAME_CONFIG.reeling.rarityDifficulty).toBe(RARITY_REELING_DIFFICULTY)
  })
})
