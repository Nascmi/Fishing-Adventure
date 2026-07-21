import { describe, expect, it } from 'vitest'
import { cabinCatalog } from './cabinCatalog'

const premiumCabins = cabinCatalog.filter((cabin) => cabin.acquisition.type === 'store' && cabin.customizationHooks)

describe('premium cabin decoration hooks', () => {
  it('gives every cabin at least one painting-compatible frame hook', () => {
    expect(cabinCatalog.every((cabin) => cabin.customizationHooks?.some((hook) => hook.type === 'frame'))).toBe(true)
  })

  it('uses functional individual hooks instead of dormant capacity slots', () => {
    expect(premiumCabins.map((cabin) => [cabin.id, cabin.customizationHooks.length])).toEqual([
      ['workshop-cabin', 12],
      ['lakeside-cottage', 4],
      ['coastal-shack', 10],
      ['trophy-room', 2],
    ])
    expect(premiumCabins.filter((cabin) => cabin.id !== 'trophy-room').every((cabin) => !cabin.slots)).toBe(true)
  })

  it('keeps every authored hook unique and inside its cabin artwork', () => {
    premiumCabins.forEach((cabin) => {
      const ids = cabin.customizationHooks.map((hook) => hook.id)
      expect(new Set(ids).size).toBe(ids.length)
      cabin.customizationHooks.forEach(({ type, bounds }) => {
        expect(['display', 'frame', 'rug', 'finish']).toContain(type)
        expect(bounds.x).toBeGreaterThanOrEqual(0)
        expect(bounds.y).toBeGreaterThanOrEqual(0)
        expect(bounds.width).toBeGreaterThan(0)
        expect(bounds.height).toBeGreaterThan(0)
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(100)
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(100)
      })
    })
  })

  it('gives the premium trophy room twelve preserved-catch mounts', () => {
    const trophyRoom = cabinCatalog.find((cabin) => cabin.id === 'trophy-room')
    expect(trophyRoom.acquisition.productId).toBe('cabin.trophy_room')
    expect(trophyRoom.slots).toEqual([{ id: 'trophy-gallery', type: 'specimen', capacity: 12 }])
    expect(trophyRoom.customizationHooks).toHaveLength(2)
  })

  it('restricts specialized premium hooks to visually appropriate decor', () => {
    const workshop = cabinCatalog.find((cabin) => cabin.id === 'workshop-cabin')
    const coastal = cabinCatalog.find((cabin) => cabin.id === 'coastal-shack')
    expect(workshop.customizationHooks.filter((hook) => hook.id.startsWith('rod-peg')).every((hook) => hook.accepts.includes('rod'))).toBe(true)
    expect(workshop.customizationHooks.filter((hook) => hook.id.startsWith('cabinet-')).every((hook) => hook.accepts.includes('tackle'))).toBe(true)
    expect(coastal.customizationHooks.find((hook) => hook.id === 'model-boat-table').accepts).toEqual(['model-boat'])
    expect(coastal.customizationHooks.filter((hook) => hook.id.startsWith('dock-peg')).every((hook) => hook.accepts.includes('nautical-peg'))).toBe(true)
  })
})
