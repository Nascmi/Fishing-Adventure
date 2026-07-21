import { describe, expect, it } from 'vitest'
import { GAME_CONFIG } from '../data/config'
import { newGame } from '../services/saveService'
import { greatLakeBoat, gulfCoastBoat } from '../data/waterSetup'
import { chooseCabinDecor, chooseCabinStyle, chooseFishingSetup, equipOwnedRod, preserveCabinSpecimen, purchaseBoat, purchaseCoinStoreItem, purchaseLure, purchaseRod, skipTimePhase, startTrip, tickGameTime } from './gameRules'

const withCoins = (coins) => ({ ...newGame(), coins })

describe('on-the-water setup', () => {
  it('buys the skiff once and gates offshore areas behind ownership', () => {
    const state = withCoins(greatLakeBoat.price + 100)
    expect(chooseFishingSetup(state, 'great-lake', 'area', 'great-lake-drop-off')).toBe(state)
    const purchased = purchaseBoat(state, greatLakeBoat.id)
    expect(purchased.coins).toBe(100)
    expect(purchased.watercraft.ownedBoatIds).toEqual([greatLakeBoat.id])
    expect(chooseFishingSetup(purchased, 'great-lake', 'area', 'great-lake-drop-off').fishingSetupByLocation['great-lake'].areaId).toBe('great-lake-drop-off')
    expect(purchaseBoat(purchased, greatLakeBoat.id)).toBe(purchased)
  })

  it('buys the Bay Skiff once and gates Gulf Coast areas behind its ownership', () => {
    const state = withCoins(gulfCoastBoat.price + 100)
    expect(chooseFishingSetup(state, 'gulf-coast', 'area', 'gulf-coast-oyster-reef')).toBe(state)
    const purchased = purchaseBoat(state, gulfCoastBoat.id)
    expect(purchased.coins).toBe(100)
    expect(purchased.watercraft.ownedBoatIds).toEqual([gulfCoastBoat.id])
    expect(chooseFishingSetup(purchased, 'gulf-coast', 'area', 'gulf-coast-tidal-channel').fishingSetupByLocation['gulf-coast'].areaId).toBe('gulf-coast-tidal-channel')
    expect(purchaseBoat(purchased, gulfCoastBoat.id)).toBe(purchased)
  })

  it('charges the Open Gulf charter relocation fee only when changing positions', () => {
    const state = withCoins(600)
    const atRig = chooseFishingSetup(state, 'open-gulf', 'area', 'open-gulf-working-rig')
    expect(atRig.coins).toBe(350)
    expect(atRig.fishingSetupByLocation['open-gulf'].areaId).toBe('open-gulf-working-rig')
    expect(chooseFishingSetup(atRig, 'open-gulf', 'area', 'open-gulf-working-rig')).toBe(atRig)

    const atReef = chooseFishingSetup(atRig, 'open-gulf', 'area', 'open-gulf-reef-edge')
    expect(atReef.coins).toBe(100)
    expect(chooseFishingSetup(atReef, 'open-gulf', 'area', 'open-gulf-blue-water')).toBe(atReef)
  })

  it('changes reusable lures without spending coins', () => {
    const state = newGame()
    const next = chooseFishingSetup(state, 'great-lake', 'lure', 'deep-jig')
    expect(next.coins).toBe(state.coins)
    expect(next.fishingSetupByLocation['great-lake'].lureId).toBe('deep-jig')
  })

  it('purchases a specialty lure once before it can be equipped', () => {
    const state = withCoins(25000)
    expect(chooseFishingSetup(state, 'great-lake', 'lure', 'muskie-bucktail')).toBe(state)
    const purchased = purchaseLure(state, 'muskie-bucktail')
    expect(purchased.coins).toBe(5000)
    expect(purchased.tackle.ownedLureIds).toEqual(['muskie-bucktail'])
    expect(chooseFishingSetup(purchased, 'great-lake', 'lure', 'muskie-bucktail').fishingSetupByLocation['great-lake'].lureId).toBe('muskie-bucktail')
    expect(purchaseLure(purchased, 'muskie-bucktail')).toBe(purchased)
  })
})

describe('equipment purchases', () => {
  it('deducts the exact rod price and records ownership', () => {
    const next = purchaseRod(withCoins(500), 'fiberglass', 'willow-pond')
    expect(next.coins).toBe(250)
    expect(next.gearByLocation['willow-pond'].ownedRods).toContain('fiberglass')
  })

  it('enforces rod prerequisites and rejects invalid locations', () => {
    const state = withCoins(10000)
    expect(purchaseRod(state, 'carbon', 'willow-pond')).toBe(state)
    expect(purchaseRod(state, 'fiberglass', 'pine-river')).toBe(state)
  })

  it('does not charge twice for an owned rod', () => {
    const purchased = purchaseRod(withCoins(500), 'fiberglass', 'willow-pond')
    expect(purchaseRod(purchased, 'fiberglass', 'willow-pond')).toBe(purchased)
  })

  it('equips only an owned rod', () => {
    const state = withCoins(500)
    expect(equipOwnedRod(state, 'carbon', 'willow-pond')).toBe(state)
    const purchased = purchaseRod(state, 'fiberglass', 'willow-pond')
    expect(equipOwnedRod(purchased, 'fiberglass', 'willow-pond').gearByLocation['willow-pond'].equippedRod).toBe('fiberglass')
  })
})

describe('Trading Post purchases and cabin selection', () => {
  it('deducts the cabin price and stores permanent ownership', () => {
    const next = purchaseCoinStoreItem(withCoins(30000), 'trading-post.cabin-riverstone')
    expect(next.coins).toBe(5000)
    expect(next.coinStore.ownedItemIds).toEqual(['trading-post.cabin-riverstone'])
  })

  it('rejects insufficient funds, unknown items, and duplicate purchases', () => {
    const poor = withCoins(100)
    expect(purchaseCoinStoreItem(poor, 'trading-post.cabin-riverstone')).toBe(poor)
    expect(purchaseCoinStoreItem(poor, 'missing')).toBe(poor)
    const purchased = purchaseCoinStoreItem(withCoins(30000), 'trading-post.cabin-riverstone')
    expect(purchaseCoinStoreItem(purchased, 'trading-post.cabin-riverstone')).toBe(purchased)
  })

  it('selects only owned or earned cabin styles', () => {
    const state = withCoins(30000)
    expect(chooseCabinStyle(state, 'riverstone-cabin')).toBe(state)
    expect(chooseCabinStyle(state, 'angler-lodge')).toBe(state)
    const purchased = purchaseCoinStoreItem(state, 'trading-post.cabin-riverstone')
    expect(chooseCabinStyle(purchased, 'riverstone-cabin').cabin.styleId).toBe('riverstone-cabin')
    const lodgeReady = { ...state, achievementProgress: { ...state.achievementProgress, legendaryLocations: ['willow-pond', 'pine-river', 'great-lake', 'gulf-coast'] } }
    expect(chooseCabinStyle(lodgeReady, 'angler-lodge').cabin.styleId).toBe('angler-lodge')
  })

  it('purchases decor permanently and equips it only on a compatible hook', () => {
    const state = purchaseCoinStoreItem(withCoins(10000), 'trading-post.rug-deep-water')
    expect(state.coins).toBe(2500)
    expect(state.coinStore.ownedItemIds).toContain('trading-post.rug-deep-water')
    const equipped = chooseCabinDecor(state, 'riverstone-cabin', 'braided-rug', 'trading-post.rug-deep-water')
    expect(equipped.cabin.decorByCabin['riverstone-cabin']['braided-rug']).toBe('trading-post.rug-deep-water')
    expect(chooseCabinDecor(state, 'riverstone-cabin', 'hearth-frame', 'trading-post.rug-deep-water')).toBe(state)
  })

  it('supports included decor, clearing a hook, and independent cabin setups', () => {
    const state = newGame()
    const riverstone = chooseCabinDecor(state, 'riverstone-cabin', 'hearth-frame', 'frame-walnut')
    const captain = chooseCabinDecor(riverstone, 'captains-retreat', 'captains-frame', 'frame-aged-brass')
    expect(captain.cabin.decorByCabin['riverstone-cabin']['hearth-frame']).toBe('frame-walnut')
    expect(captain.cabin.decorByCabin['captains-retreat']['captains-frame']).toBe('frame-aged-brass')
    expect(chooseCabinDecor(captain, 'riverstone-cabin', 'hearth-frame', null).cabin.decorByCabin['riverstone-cabin']['hearth-frame']).toBeNull()
  })
})

describe('charters', () => {
  it('books a destination, deducts its fee, and immediately unlocks Gone Fishing', () => {
    const next = startTrip(withCoins(1000), 'pine-river', 12345)
    expect(next.coins).toBe(700)
    expect(next.dayCycle.activeTrip.locationId).toBe('pine-river')
    expect(next.dayCycle.activeTrip.remainingMs).toBe(GAME_CONFIG.dayCycle.phaseMs * 12)
    expect(next.achievements['gone-fishing']).toEqual({ unlockedAt: 12345 })
  })

  it('rejects the free home water and unaffordable destinations', () => {
    const state = withCoins(10)
    expect(startTrip(state, 'willow-pond')).toBe(state)
    expect(startTrip(state, 'open-gulf')).toBe(state)
  })

  it('completes a charter, records it once, and awards its painting and keepsake', () => {
    const booked = startTrip(withCoins(1000), 'pine-river', 1)
    const nearlyDone = { ...booked, dayCycle: { ...booked.dayCycle, activeTrip: { ...booked.dayCycle.activeTrip, remainingMs: 50000 } } }
    const completed = tickGameTime(nearlyDone, 'pine-river', 60000, () => 0.5, 2)
    expect(completed.dayCycle.activeTrip).toBeNull()
    expect(completed.achievementProgress.completedTrips).toEqual(['pine-river'])
    expect(completed.achievementProgress.paintingsEarned).toContain('pine-river')
    expect(completed.achievements['three-days']).toEqual({ unlockedAt: 2 })
  })

  it('can complete the last phase through Skip Ahead', () => {
    const booked = startTrip(withCoins(1000), 'pine-river', 1)
    const nearlyDone = { ...booked, dayCycle: { ...booked.dayCycle, activeTrip: { locationId: 'pine-river', elapsedMs: GAME_CONFIG.dayCycle.phaseMs * 11, remainingMs: GAME_CONFIG.dayCycle.phaseMs } } }
    expect(skipTimePhase(nearlyDone, 'pine-river', 2).achievementProgress.completedTrips).toContain('pine-river')
  })
})

describe('trophy preservation', () => {
  const specimen = { fishId: 'bluegill', weight: 1.7, sizeTier: 'trophy', locationId: 'willow-pond', phase: 'morning', caughtAt: '2026-01-01T00:00:00.000Z', mounted: null }

  it('charges once and records an exact preservation timestamp', () => {
    const state = { ...withCoins(150), cabin: { ...newGame().cabin, specimens: { bluegill: specimen } } }
    const next = preserveCabinSpecimen(state, 'bluegill', 777)
    expect(next.coins).toBe(50)
    expect(next.cabin.specimens.bluegill.mounted.preservedAt).toBe(777)
    expect(next.cabin.featuredFishId).toBe('bluegill')
  })

  it('rejects unaffordable first mounts and makes heavier upgrades free', () => {
    const poor = { ...withCoins(99), cabin: { ...newGame().cabin, specimens: { bluegill: specimen } } }
    expect(preserveCabinSpecimen(poor, 'bluegill')).toBe(poor)
    const mounted = { ...specimen, weight: 1.8, mounted: { ...specimen, weight: 1.7, preservedAt: 1 } }
    const upgradeState = { ...withCoins(0), cabin: { ...newGame().cabin, specimens: { bluegill: mounted } } }
    const upgraded = preserveCabinSpecimen(upgradeState, 'bluegill', 2)
    expect(upgraded.coins).toBe(0)
    expect(upgraded.cabin.specimens.bluegill.mounted.weight).toBe(1.8)
  })
})
