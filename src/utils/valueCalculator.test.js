import { describe, expect, it } from 'vitest'
import { fish } from '../data/fish'
import { classifyStoredCatch, classifyWeight, getWeightTier, makeCatch } from './valueCalculator'

const bluegill = fish.find((item) => item.id === 'bluegill')
const sequence = (...values) => {
  let index = 0
  return () => values[Math.min(index++, values.length - 1)]
}

describe('specimen sizes and values', () => {
  it.each([
    [0.5, 'ordinary'],
    [0.51, 'good'],
    [0.76, 'trophy'],
    [0.91, 'amazing'],
    [1, 'amazing'],
  ])('classifies %s of maximum as %s', (ratio, tier) => {
    expect(classifyWeight(bluegill, bluegill.maxWeight * ratio)).toBe(tier)
  })

  it('falls an unknown tier ID back to the regular tier', () => {
    expect(getWeightTier('unknown').id).toBe('ordinary')
  })

  it('creates deterministic catches with bounded weight and timestamp', () => {
    const caught = makeCatch(bluegill, sequence(0.99, 1, 0.25), 1700000000000)
    expect(caught.sizeTier).toBe('amazing')
    expect(caught.weight).toBe(bluegill.maxWeight)
    expect(caught.value).toBeGreaterThan(0)
    expect(caught.catchId).toBe('1700000000000-9')
    expect(caught.caughtAt).toBe('2023-11-14T22:13:20.000Z')
  })

  it('gives a larger comparable catch a greater value', () => {
    const small = makeCatch(bluegill, sequence(0, 0, 0.1), 1)
    const large = makeCatch(bluegill, sequence(0, 1, 0.1), 2)
    expect(large.weight).toBeGreaterThan(small.weight)
    expect(large.value).toBeGreaterThan(small.value)
  })

  it('classifies old catches from stored weight', () => {
    expect(classifyStoredCatch({ fishId: bluegill.id, weight: bluegill.maxWeight * 0.8 })).toBe('trophy')
    expect(classifyStoredCatch({ fishId: 'missing', weight: 10 })).toBe('ordinary')
  })
})
