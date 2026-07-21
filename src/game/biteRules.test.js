import { describe, expect, it } from 'vitest'
import { getQuietCastChance, isQuietCast } from './biteRules'

describe('quiet casts', () => {
  it('caps ordinary rods at three percent and high-end rods at one and a half percent', () => {
    expect(getQuietCastChance({ quietCastChance: 8 })).toBe(3)
    expect(getQuietCastChance({ quietCastChance: 1 })).toBe(1.5)
  })

  it('never allows back-to-back quiet casts', () => {
    expect(isQuietCast({ quietCastChance: 3 }, false, () => .02)).toBe(true)
    expect(isQuietCast({ quietCastChance: 3 }, true, () => 0)).toBe(false)
  })
})
