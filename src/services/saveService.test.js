import { afterEach, describe, expect, it } from 'vitest'
import { loadGame, newGame, saveGame, validateSave } from './saveService'

const legacyStats = { totalCaught: 0, totalCoinsEarned: 0, totalCasts: 0, escaped: 0, largestFish: null, rarestFish: null }
const originalLocalStorage = globalThis.localStorage

afterEach(() => {
  if (originalLocalStorage === undefined) delete globalThis.localStorage
  else globalThis.localStorage = originalLocalStorage
})

describe('save migrations and validation', () => {
  it('creates a complete current-version new game', () => {
    const state = newGame()
    expect(state.version).toBe(28)
    expect(state.coinStore).toEqual({ ownedItemIds: [] })
    expect(state.cabin.styleId).toBe('starter')
    expect(Object.keys(state.gearByLocation)).toHaveLength(5)
    expect(state.activities).toEqual({ fieldNotes: { entries: [], lastGeneratedDay: null }, derbies: { active: null, personalBests: {} } })
  })

  it('migrates a representative version 1 save without losing pond gear or coins', () => {
    const state = validateSave({
      version: 1,
      coins: 432,
      inventory: [],
      collection: {},
      ownedRods: ['old', 'fiberglass'],
      equippedRod: 'fiberglass',
      stats: legacyStats,
    })
    expect(state.version).toBe(28)
    expect(state.coins).toBe(432)
    expect(state.gearByLocation['willow-pond']).toEqual({ ownedRods: ['old', 'fiberglass'], equippedRod: 'fiberglass' })
    expect(state.gearByLocation['open-gulf'].ownedRods).toContain('offshore-starter')
    expect(state.settings.reactionWindow).toBe('relaxed')
  })

  it('migrates a version 12 Trophy catch into a remembered specimen', () => {
    const state = validateSave({
      version: 12,
      coins: 50,
      inventory: [{ catchId: 'legacy-trophy', fishId: 'bluegill', name: 'Bluegill', rarity: 'common', weight: 1.6, sizeTier: 'trophy', value: 20, caughtAt: '2025-01-01T00:00:00.000Z', locationId: 'willow-pond', phase: 'morning' }],
      collection: { bluegill: { count: 1, largestWeight: 1.6 } },
      gearByLocation: {},
      cabin: { styleId: 'starter' },
      dayCycle: { homeElapsedMs: 0, activeTrip: null },
      achievements: {},
      achievementProgress: {},
      settings: {},
      stats: { ...legacyStats, totalCaught: 1 },
    })
    expect(state.version).toBe(28)
    expect(state.cabin.specimens.bluegill).toMatchObject({ fishId: 'bluegill', weight: 1.6, sizeTier: 'great' })
    expect(state.cabin.specimens.bluegill.mounted).toBeNull()
  })

  it('migrates version 16 with an empty Trading Post ownership set', () => {
    const state = validateSave({ version: 16, coins: 90 })
    expect(state.version).toBe(28)
    expect(state.coinStore.ownedItemIds).toEqual([])
  })

  it('preserves valid version 17 ownership and rejects unknown product IDs', () => {
    const state = validateSave({
      version: 17,
      coins: 10,
      coinStore: { ownedItemIds: ['trading-post.cabin-riverstone', 'not-a-product', 'trading-post.cabin-riverstone'] },
      cabin: { styleId: 'riverstone-cabin' },
    })
    expect(state.coinStore.ownedItemIds).toEqual(['trading-post.cabin-riverstone'])
    expect(state.cabin.styleId).toBe('riverstone-cabin')
  })

  it('migrates version 17 with independent empty cabin decor selections', () => {
    const state = validateSave({ version: 17, coinStore: { ownedItemIds: ['trading-post.cabin-riverstone'] }, cabin: { styleId: 'riverstone-cabin' } })
    expect(state.version).toBe(28)
    expect(state.cabin.decorByCabin['riverstone-cabin']).toEqual({ 'hearth-frame': { artworkId: null, frameId: null }, 'river-shelf': null })
  })

  it('adds empty optional activities to a version 27 save without changing progress', () => {
    const state = validateSave({ version: 27, coins: 4321, activities: { fieldNotes: { entries: [{ id: 'ignored-old-shape' }] } } })
    expect(state.version).toBe(28)
    expect(state.coins).toBe(4321)
    expect(state.activities).toEqual({ fieldNotes: { entries: [], lastGeneratedDay: null }, derbies: { active: null, personalBests: {} } })
  })

  it('removes retired rug ownership and selections while rejecting incompatible decor', () => {
    const state = validateSave({
      version: 18,
      coinStore: { ownedItemIds: ['trading-post.cabin-riverstone', 'trading-post.rug-deep-water'] },
      cabin: { styleId: 'riverstone-cabin', decorByCabin: { 'riverstone-cabin': { 'braided-rug': 'trading-post.rug-deep-water', 'hearth-frame': 'trading-post.rug-deep-water', 'river-shelf': 'trading-post.decor-antique-creel' } } },
    })
    expect(state.coinStore.ownedItemIds).toEqual(['trading-post.cabin-riverstone'])
    expect(state.cabin.decorByCabin['riverstone-cabin']).toEqual({ 'hearth-frame': { artworkId: null, frameId: null }, 'river-shelf': null })
  })

  it('preserves a complete version 18 journey across the version 19 migration', () => {
    const state = validateSave({
      version: 18,
      coins: 24680,
      gearByLocation: {
        'pine-river': { ownedRods: ['worn-fly', 'fiberglass-fly'], equippedRod: 'fiberglass-fly' },
      },
      collection: { bluegill: { count: 3, largestWeight: 1.8 } },
      coinStore: { ownedItemIds: ['trading-post.cabin-riverstone', 'trading-post.rug-deep-water'] },
      cabin: {
        styleId: 'riverstone-cabin',
        featuredFishId: 'bluegill',
        specimens: {
          bluegill: {
            fishId: 'bluegill', weight: 1.8, sizeTier: 'amazing', locationId: 'willow-pond', phase: 'evening', caughtAt: '2026-06-01T12:00:00.000Z',
            mounted: { weight: 1.8, sizeTier: 'amazing', locationId: 'willow-pond', phase: 'evening', caughtAt: '2026-06-01T12:00:00.000Z', preservedAt: 123456 },
          },
        },
        decorByCabin: { 'riverstone-cabin': { 'braided-rug': 'trading-post.rug-deep-water' } },
      },
      dayCycle: { homeElapsedMs: 5000, activeTrip: { locationId: 'pine-river', elapsedMs: 60000, remainingMs: 120000 } },
      achievements: { 'gone-fishing': { unlockedAt: 123 } },
      achievementProgress: { locationsFished: ['willow-pond', 'pine-river'], completedTrips: [], peakMoments: [] },
    })

    expect(state.version).toBe(28)
    expect(state.coins).toBe(24680)
    expect(state.gearByLocation['pine-river']).toEqual({ ownedRods: ['worn-fly', 'fiberglass-fly'], equippedRod: 'fiberglass-fly' })
    expect(state.dayCycle.activeTrip).toEqual({ locationId: 'pine-river', elapsedMs: 60000, remainingMs: 120000 })
    expect(state.achievements['gone-fishing']).toEqual({ unlockedAt: 123 })
    expect(state.achievementProgress.locationsFished).toContain('pine-river')
    expect(state.coinStore.ownedItemIds).toEqual(['trading-post.cabin-riverstone'])
    expect(state.cabin.styleId).toBe('riverstone-cabin')
    expect(state.cabin.specimens.bluegill).toMatchObject({ fishId: 'bluegill', weight: 1.8, sizeTier: 'trophy' })
    expect(state.cabin.specimens.bluegill.mounted).toMatchObject({ weight: 1.8, sizeTier: 'trophy', preservedAt: 123456 })
    expect(state.cabin.featuredFishId).toBe('bluegill')
    expect(state.cabin.decorByCabin['riverstone-cabin']).not.toHaveProperty('braided-rug')
  })

  it('adds safe Phase 4 defaults to version 19 saves and preserves valid version 20 setup', () => {
    const migrated = validateSave({ version: 19, coins: 300 })
    expect(migrated.version).toBe(28)
    expect(migrated.watercraft.ownedBoatIds).toEqual([])
    expect(migrated.fishingSetupByLocation['great-lake']).toEqual({ areaId: 'great-lake-shore', lureId: 'spoon' })

    const preserved = validateSave({
      version: 20,
      watercraft: { ownedBoatIds: ['great-lake-skiff'] },
      fishingSetupByLocation: { 'great-lake': { areaId: 'great-lake-drop-off', lureId: 'deep-jig' } },
    })
    expect(preserved.watercraft.ownedBoatIds).toEqual(['great-lake-skiff'])
    expect(preserved.fishingSetupByLocation['great-lake']).toEqual({ areaId: 'great-lake-drop-off', lureId: 'deep-jig' })
    expect(preserved.tackle.ownedLureIds).toEqual([])
  })

  it('preserves purchased specialty lures and rejects unowned equipped lures', () => {
    const owned = validateSave({ version: 21, tackle: { ownedLureIds: ['muskie-bucktail'] }, fishingSetupByLocation: { 'great-lake': { areaId: 'great-lake-shore', lureId: 'muskie-bucktail' } } })
    expect(owned.tackle.ownedLureIds).toEqual(['muskie-bucktail'])
    expect(owned.fishingSetupByLocation['great-lake'].lureId).toBe('muskie-bucktail')
    expect(validateSave({ version: 21, fishingSetupByLocation: { 'great-lake': { lureId: 'muskie-bucktail' } } }).fishingSetupByLocation['great-lake'].lureId).toBe('spoon')
  })

  it('adds the Gulf Coast shore default to version 21 and preserves an owned Bay Skiff setup', () => {
    expect(validateSave({ version: 21 }).fishingSetupByLocation['gulf-coast']).toEqual({ areaId: 'gulf-coast-marsh-bank', lureId: 'popping-shrimp' })

    const preserved = validateSave({
      version: 22,
      watercraft: { ownedBoatIds: ['gulf-coast-bay-skiff'] },
      fishingSetupByLocation: { 'gulf-coast': { areaId: 'gulf-coast-oyster-reef', lureId: 'popping-shrimp' } },
    })
    expect(preserved.watercraft.ownedBoatIds).toEqual(['gulf-coast-bay-skiff'])
    expect(preserved.fishingSetupByLocation['gulf-coast']).toEqual({ areaId: 'gulf-coast-oyster-reef', lureId: 'popping-shrimp' })
  })

  it('adds Blue Water as the safe Open Gulf position for version 22 saves', () => {
    expect(validateSave({ version: 22 }).fishingSetupByLocation['open-gulf']).toEqual({ areaId: 'open-gulf-blue-water', lureId: 'metal-jig' })
  })

  it('returns an unowned or unknown cabin to the Starter Cabin', () => {
    expect(validateSave({ version: 17, cabin: { styleId: 'captains-retreat' } }).cabin.styleId).toBe('starter')
    expect(validateSave({ version: 17, cabin: { styleId: 'imaginary-cabin' } }).cabin.styleId).toBe('starter')
  })

  it('migrates version 23 saves and validates only known commerce entitlements', () => {
    const migrated = validateSave({ version: 23, commerce: { entitlementIds: ['cabin:workshop-cabin'] } })
    expect(migrated.version).toBe(28)
    expect(migrated.commerce.entitlementIds).toEqual([])

    const entitled = validateSave({ version: 25, commerce: { entitlementIds: ['cabin:workshop-cabin', 'supporter:community', 'fake:power'] }, cabin: { styleId: 'workshop-cabin' } })
    expect(entitled.commerce.entitlementIds).toEqual(['cabin:workshop-cabin', 'supporter:community'])
    expect(entitled.cabin.styleId).toBe('workshop-cabin')
  })

  it('validates twelve unique Grand Trophy Room displays', () => {
    const base = newGame()
    const mounted = { weight: 1.2, sizeTier: 'great', locationId: 'willow-pond', phase: 'morning', caughtAt: null, preservedAt: 1 }
    const state = validateSave({
      ...base,
      version: 26,
      commerce: { entitlementIds: ['cabin:trophy-room'] },
      cabin: {
        ...base.cabin,
        styleId: 'trophy-room',
        specimens: { bluegill: { fishId: 'bluegill', weight: 1.2, sizeTier: 'great', locationId: 'willow-pond', phase: 'morning', caughtAt: null, mounted } },
        trophyRoomFeaturedFishIds: ['bluegill', 'bluegill', 'not-a-fish'],
      },
    })
    expect(state.version).toBe(28)
    expect(state.cabin.styleId).toBe('trophy-room')
    expect(state.cabin.trophyRoomFeaturedFishIds).toHaveLength(12)
    expect(state.cabin.trophyRoomFeaturedFishIds.slice(0, 3)).toEqual(['bluegill', null, null])
  })

  it('migrates boat finishes and rejects unearned or unknown cosmetics', () => {
    const valid = validateSave({
      version: 25,
      commerce: { entitlementIds: ['boat-style:great-lake-classics'] },
      watercraft: { ownedBoatIds: ['great-lake-skiff'], cosmeticByBoat: { 'great-lake-skiff': 'great-lake-midnight' } },
    })
    expect(valid.watercraft.cosmeticByBoat['great-lake-skiff']).toBe('great-lake-midnight')
    const unearned = validateSave({ version: 25, commerce: { entitlementIds: ['boat-style:great-lake-classics'] }, watercraft: { cosmeticByBoat: { 'great-lake-skiff': 'great-lake-midnight' } } })
    expect(unearned.watercraft.cosmeticByBoat['great-lake-skiff']).toBe('great-lake-original')
  })

  it('repairs partially missing and malformed data', () => {
    const state = validateSave({
      version: 17,
      coins: -500,
      inventory: [{ catchId: 'bad', fishId: 'not-a-fish', weight: -2, value: -1 }],
      collection: { bluegill: { count: -4, largestWeight: 0 } },
      coinStore: { ownedItemIds: 'wrong-type' },
      settings: { reactionWindow: 'impossible', soundEnabled: 'yes' },
      dayCycle: { activeTrip: { locationId: 'not-a-place', remainingMs: Infinity } },
    })
    expect(state.coins).toBe(50)
    expect(state.inventory).toEqual([])
    expect(state.collection).toEqual({})
    expect(state.coinStore.ownedItemIds).toEqual([])
    expect(state.settings.reactionWindow).toBe('relaxed')
    expect(state.dayCycle.activeTrip).toBeNull()
  })

  it('falls back safely for null and non-object input', () => {
    expect(validateSave(null).version).toBe(28)
    expect(validateSave('damaged').version).toBe(28)
    expect(validateSave(null).coins).toBe(50)
  })

  it('keeps a recovery copy when serialized storage is unreadable', () => {
    const writes = new Map()
    globalThis.localStorage = {
      getItem: () => '{not-json',
      setItem: (key, value) => writes.set(key, value),
      removeItem: () => {},
    }
    const loaded = loadGame()
    expect(loaded.game.version).toBe(28)
    expect(loaded.notice).toMatch(/could not read/i)
    expect([...writes.values()]).toContain('{not-json')
  })

  it('never changes saved coins based on the runtime hostname', () => {
    const values = new Map([['fishing-adventure-save-v1', JSON.stringify({ version: 27, coins: 125 })]])
    globalThis.localStorage = {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    }
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', { configurable: true, value: { hostname: 'localhost' } })
    expect(loadGame().game.coins).toBe(125)
    expect(loadGame().game.coins).toBe(125)
    if (originalLocation === undefined) delete globalThis.location
    else Object.defineProperty(globalThis, 'location', { configurable: true, value: originalLocation })
  })

  it('reports unavailable storage instead of throwing while saving', () => {
    globalThis.localStorage = { setItem: () => { throw new Error('blocked') } }
    expect(saveGame(newGame())).toBe(false)
  })
})
