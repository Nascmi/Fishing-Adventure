import { afterEach, describe, expect, it } from 'vitest'
import { loadGame, newGame, saveGame, validateSave } from './saveService'

const legacyStats = { totalCaught: 0, totalCoinsEarned: 0, totalCasts: 0, escaped: 0, largestFish: null, rarestFish: null }
const originalLocalStorage = globalThis.localStorage

afterEach(() => {
  if (originalLocalStorage === undefined) delete globalThis.localStorage
  else globalThis.localStorage = originalLocalStorage
})

describe('save migrations and validation', () => {
  it('creates a complete version 19 new game', () => {
    const state = newGame()
    expect(state.version).toBe(23)
    expect(state.coinStore).toEqual({ ownedItemIds: [] })
    expect(state.cabin.styleId).toBe('starter')
    expect(Object.keys(state.gearByLocation)).toHaveLength(5)
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
    expect(state.version).toBe(23)
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
    expect(state.version).toBe(23)
    expect(state.cabin.specimens.bluegill).toMatchObject({ fishId: 'bluegill', weight: 1.6, sizeTier: 'great' })
    expect(state.cabin.specimens.bluegill.mounted).toBeNull()
  })

  it('migrates version 16 with an empty Trading Post ownership set', () => {
    const state = validateSave({ version: 16, coins: 90 })
    expect(state.version).toBe(23)
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
    expect(state.version).toBe(23)
    expect(state.cabin.decorByCabin['riverstone-cabin']).toEqual({ 'hearth-frame': null, 'river-shelf': null, 'braided-rug': null })
  })

  it('preserves compatible owned decor and rejects incompatible or unowned selections', () => {
    const state = validateSave({
      version: 18,
      coinStore: { ownedItemIds: ['trading-post.cabin-riverstone', 'trading-post.rug-deep-water'] },
      cabin: { styleId: 'riverstone-cabin', decorByCabin: { 'riverstone-cabin': { 'braided-rug': 'trading-post.rug-deep-water', 'hearth-frame': 'trading-post.rug-deep-water', 'river-shelf': 'trading-post.decor-antique-creel' } } },
    })
    expect(state.cabin.decorByCabin['riverstone-cabin']).toEqual({ 'hearth-frame': null, 'river-shelf': null, 'braided-rug': 'trading-post.rug-deep-water' })
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

    expect(state.version).toBe(23)
    expect(state.coins).toBe(24680)
    expect(state.gearByLocation['pine-river']).toEqual({ ownedRods: ['worn-fly', 'fiberglass-fly'], equippedRod: 'fiberglass-fly' })
    expect(state.dayCycle.activeTrip).toEqual({ locationId: 'pine-river', elapsedMs: 60000, remainingMs: 120000 })
    expect(state.achievements['gone-fishing']).toEqual({ unlockedAt: 123 })
    expect(state.achievementProgress.locationsFished).toContain('pine-river')
    expect(state.coinStore.ownedItemIds).toEqual(['trading-post.cabin-riverstone', 'trading-post.rug-deep-water'])
    expect(state.cabin.styleId).toBe('riverstone-cabin')
    expect(state.cabin.specimens.bluegill).toMatchObject({ fishId: 'bluegill', weight: 1.8, sizeTier: 'trophy' })
    expect(state.cabin.specimens.bluegill.mounted).toMatchObject({ weight: 1.8, sizeTier: 'trophy', preservedAt: 123456 })
    expect(state.cabin.featuredFishId).toBe('bluegill')
    expect(state.cabin.decorByCabin['riverstone-cabin']['braided-rug']).toBe('trading-post.rug-deep-water')
  })

  it('adds safe Phase 4 defaults to version 19 saves and preserves valid version 20 setup', () => {
    const migrated = validateSave({ version: 19, coins: 300 })
    expect(migrated.version).toBe(23)
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
    expect(validateSave(null).version).toBe(23)
    expect(validateSave('damaged').version).toBe(23)
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
    expect(loaded.game.version).toBe(23)
    expect(loaded.notice).toMatch(/could not read/i)
    expect([...writes.values()]).toContain('{not-json')
  })

  it('reports unavailable storage instead of throwing while saving', () => {
    globalThis.localStorage = { setItem: () => { throw new Error('blocked') } }
    expect(saveGame(newGame())).toBe(false)
  })
})
