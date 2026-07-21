import { describe, expect, it } from 'vitest'
import { unlockAchievements } from './achievements'
import { fish } from './fish'
import { locations } from './locations'
import { unlockLocationCosmetics } from './locationPaintings'
import { getRodsForLocation } from './rods'
import { newGame } from '../services/saveService'

describe('keepsake progression', () => {
  it('unlocks first-cast and first-story from their recorded statistics', () => {
    const state = newGame()
    const result = unlockAchievements({ ...state, stats: { ...state.stats, totalCasts: 1, totalCaught: 1 } }, 55)
    expect(result.state.achievements['first-cast']).toEqual({ unlockedAt: 55 })
    expect(result.state.achievements['first-story']).toEqual({ unlockedAt: 55 })
  })

  it('does not rewrite the date of an existing keepsake', () => {
    const state = { ...newGame(), achievements: { 'first-cast': { unlockedAt: 10 } }, stats: { ...newGame().stats, totalCasts: 2 } }
    expect(unlockAchievements(state, 99).state.achievements['first-cast']).toEqual({ unlockedAt: 10 })
  })
})

describe('earned cabin cosmetics', () => {
  it('earns the Backyard Pond painting and upgraded souvenir for a full local journal', () => {
    const state = newGame()
    const pond = locations.find((location) => location.id === 'willow-pond')
    const collection = Object.fromEntries(pond.fishIds.map((id) => [id, { count: 1, largestWeight: 1 }]))
    const next = unlockLocationCosmetics({ ...state, collection })
    expect(next.achievementProgress.paintingsEarned).toContain('willow-pond')
    expect(next.achievementProgress.upgradedSouvenirs).toContain('willow-pond')
  })

  it('earns a destination painting only after charter completion', () => {
    const state = newGame()
    expect(unlockLocationCosmetics(state).achievementProgress.paintingsEarned).not.toContain('pine-river')
    const complete = { ...state, achievementProgress: { ...state.achievementProgress, completedTrips: ['pine-river'] } }
    expect(unlockLocationCosmetics(complete).achievementProgress.paintingsEarned).toContain('pine-river')
  })

  it('earns a Master Angler frame from Trophy-or-better records for every local species', () => {
    const state = newGame()
    const pond = locations.find((location) => location.id === 'willow-pond')
    const specimens = Object.fromEntries(pond.fishIds.map((fishId) => [fishId, { fishId, weight: 1, sizeTier: 'great' }]))
    const next = unlockLocationCosmetics({ ...state, cabin: { ...state.cabin, specimens } })
    expect(next.achievementProgress.masterFramesEarned).toContain('willow-pond')
  })

  it('earns Amazing photographs and legendary miniatures from records', () => {
    const state = newGame()
    const legendary = fish.find((item) => item.rarity === 'legendary')
    const next = unlockLocationCosmetics({
      ...state,
      collection: { [legendary.id]: { count: 1, largestWeight: legendary.maxWeight } },
      cabin: { ...state.cabin, specimens: { [legendary.id]: { fishId: legendary.id, weight: legendary.maxWeight, sizeTier: 'trophy' } } },
    })
    expect(next.achievementProgress.amazingPhotos).toContain(legendary.id)
    expect(next.achievementProgress.legendaryMiniatures).toContain(legendary.id)
  })

  it('earns an equipment plaque for owning a complete location rod family', () => {
    const state = newGame()
    const ownedRods = getRodsForLocation('great-lake').map((rod) => rod.id)
    const next = unlockLocationCosmetics({ ...state, gearByLocation: { ...state.gearByLocation, 'great-lake': { ownedRods, equippedRod: ownedRods[0] } } })
    expect(next.achievementProgress.equipmentPlaques).toContain('great-lake')
  })
})
