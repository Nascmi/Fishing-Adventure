import { describe, expect, it } from 'vitest'
import { lodgeLayout } from './lodgeLayout'

describe('Angler lodge anchor zones', () => {
  it('defines three specimen mounts and twenty keepsake cells', () => {
    expect(lodgeLayout.specimenMounts).toHaveLength(3)
    expect(lodgeLayout.keepsakeCabinet.columns * lodgeLayout.keepsakeCabinet.rows).toBe(20)
    expect(lodgeLayout.keepsakeCabinet.shareOffsetX).toBe(5)
  })

  it('keeps every authored zone inside the cabin artwork', () => {
    const zones = [...lodgeLayout.specimenMounts, lodgeLayout.keepsakeCabinet]
    for (const zone of zones) {
      expect(zone.x).toBeGreaterThanOrEqual(0)
      expect(zone.y).toBeGreaterThanOrEqual(0)
      expect(zone.x + zone.width).toBeLessThanOrEqual(100)
      expect(zone.y + zone.height).toBeLessThanOrEqual(100)
    }
  })
})
