import { describe, expect, it } from 'vitest'
import { selectFish } from './fishingEngine'
import { getPhaseFourFishWeights } from '../data/waterSetup'

const masterChances = { common: 38, uncommon: 31, rare: 21, epic: 8.5, legendary: 1.5 }

describe('fish selection', () => {
  it('never selects outside the active location pool', () => {
    const allowed = ['bluegill', 'sunfish', 'crappie', 'largemouth-bass', 'catfish', 'old-whiskers']
    for (let index = 0; index <= 100; index += 1) {
      const selected = selectFish(masterChances, allowed, 'morning', () => index / 100)
      expect(allowed).toContain(selected.id)
    }
  })

  it('falls an unavailable rolled rarity down within the same location', () => {
    const selected = selectFish({ legendary: 100 }, ['bluegill'], 'morning', () => 0.99)
    expect(selected.id).toBe('bluegill')
  })

  it('gives a preferred-period species additional relative weight', () => {
    const selected = selectFish({ common: 100 }, ['bluegill', 'sunfish'], 'morning', () => 0.6)
    expect(selected.id).toBe('bluegill')
  })

  it('has a safe fallback for an empty pool', () => {
    expect(selectFish(masterChances, [], 'morning', () => 0.5)).toBeDefined()
  })

  it('applies setup strengths without creating weight for a rarity absent from the rod', () => {
    const selected = selectFish({ common: 100 }, ['perch', 'rock-bass', 'walleye'], 'night', () => 0.6, { perch: 10 })
    expect(selected.id).toBe('perch')
    expect(selected.rarity).toBe('common')
  })

  it('gives purchased specialty lures a twenty percent relative target affinity', () => {
    expect(getPhaseFourFishWeights(null, 'cobia-eel').cobia).toBeCloseTo(1.2)
  })

  it('applies five percent affinity to every fish in an affordable tackle group', () => {
    const weights = getPhaseFourFishWeights(null, 'panfish-bites')
    expect(weights.bluegill).toBeCloseTo(1.05)
    expect(weights.sunfish).toBeCloseTo(1.05)
    expect(weights.crappie).toBeCloseTo(1.05)
    expect(weights['largemouth-bass']).toBeUndefined()
  })
})
