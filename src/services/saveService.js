import { GAME_CONFIG } from '../data/config'
import { fish } from '../data/fish'
import { getRodsForLocation, getStarterRod, rodLocationIds } from '../data/rods'
import { classifyStoredCatch, getWeightTier } from '../utils/valueCalculator'
import { achievements as achievementDefinitions, unlockAchievements } from '../data/achievements'
import { locations } from '../data/locations'
import { unlockLocationCosmetics } from '../data/locationPaintings'
import { coinStoreItems } from '../data/coinStoreCatalog'
import { cabinCatalog } from '../data/cabinCatalog'
import { getCabinDecor, isDecorCompatible, isDecorOwned } from '../data/cabinDecor'
import { boats, fishingAreas, getAreasForLocation, getBoatForLocation, getDefaultLure, lureFamilies } from '../data/waterSetup'
import { hasProductEntitlement, knownEntitlementIds } from '../data/storeCatalog'
import { boatCosmetics, getDefaultBoatCosmetic } from '../data/boatCosmetics'
import { defaultActivities, validateActivities } from '../game/activityRules'

const SAVE_KEY = 'fishing-adventure-save-v1'
const RECOVERY_KEY = 'fishing-adventure-recovery-v1'
const LOCALHOST_COIN_GRANT_KEY = 'fishing-adventure-localhost-million-v1'
const CURRENT_VERSION = 28
const defaultFishingSetups = () => Object.fromEntries(rodLocationIds.map((locationId) => [locationId, {
  areaId: getAreasForLocation(locationId)[0]?.id || null,
  lureId: getDefaultLure(locationId).id,
}]))
const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary']
const defaultCabin = () => ({
  styleId: 'starter',
  featuredFishId: null,
  lodgeFeaturedFishIds: [null, null, null],
  trophyRoomFeaturedFishIds: Array(12).fill(null),
  souvenirLocationId: 'willow-pond',
  specimens: {},
  decorByCabin: {},
})
const randomBetween = (minimum, maximum) => Math.round(minimum + Math.random() * (maximum - minimum))
const defaultWeather = () => ({
  nextRainMs: randomBetween(GAME_CONFIG.weather.minRainIntervalMs, GAME_CONFIG.weather.maxRainIntervalMs),
  rainRemainingMs: 0,
})

export const newGame = () => ({
  version: CURRENT_VERSION,
  coins: GAME_CONFIG.startingCoins,
  inventory: [],
  gearByLocation: Object.fromEntries(
    rodLocationIds.map((locationId) => {
      const starterId = getStarterRod(locationId).id
      return [locationId, { ownedRods: [starterId], equippedRod: starterId }]
    }),
  ),
  collection: {},
  coinStore: { ownedItemIds: [] },
  commerce: { entitlementIds: [] },
  watercraft: { ownedBoatIds: [], cosmeticByBoat: Object.fromEntries(boats.map((boat) => [boat.id, getDefaultBoatCosmetic(boat.id)?.id || null])) },
  tackle: { ownedLureIds: [] },
  fishingSetupByLocation: defaultFishingSetups(),
  cabin: defaultCabin(),
  weather: defaultWeather(),
  dayCycle: { homeElapsedMs: 0, activeTrip: null },
  activities: defaultActivities(),
  achievements: {},
  achievementProgress: {
    locationsFished: ['willow-pond'],
    locationsCaught: [],
    phasesCaught: [],
    peakMoments: [],
    completedTrips: [],
    legendaryLocations: [],
    paintingsEarned: [],
    masterFramesEarned: [],
    upgradedSouvenirs: [],
    equipmentPlaques: [],
    amazingPhotos: [],
    legendaryMiniatures: [],
    amazingLegendaryCaught: false,
  },
  settings: { reactionWindow: 'relaxed', soundEnabled: true, hapticsEnabled: true, ambienceEnabled: false },
  stats: {
    totalCaught: 0,
    totalCoinsEarned: 0,
    totalCasts: 0,
    escaped: 0,
    quietCasts: 0,
    largestFish: null,
    rarestFish: null,
  },
})

function migrateSave(raw) {
  if (!raw || typeof raw !== 'object') return raw
  const migrated = { ...raw }
  if (!Number.isInteger(migrated.version) || migrated.version < 2) {
    migrated.settings = { reactionWindow: 'relaxed', ...(migrated.settings || {}) }
    migrated.version = 2
  }
  if (migrated.version < 3) {
    migrated.settings = {
      soundEnabled: true,
      hapticsEnabled: true,
      ...(migrated.settings || {}),
    }
    migrated.version = 3
  }
  if (migrated.version < 4) migrated.version = 4
  if (migrated.version < 5) {
    migrated.settings = { ambienceEnabled: false, ...(migrated.settings || {}) }
    migrated.version = 5
  }
  if (migrated.version < 6) {
    migrated.gearByLocation = {
      'willow-pond': {
        ownedRods: migrated.ownedRods,
        equippedRod: migrated.equippedRod,
      },
      'pine-river': {
        ownedRods: ['worn-fly'],
        equippedRod: 'worn-fly',
      },
    }
    delete migrated.ownedRods
    delete migrated.equippedRod
    migrated.version = 6
  }
  if (migrated.version < 7) {
    migrated.gearByLocation = {
      ...migrated.gearByLocation,
      'great-lake': {
        ownedRods: ['lake-starter'],
        equippedRod: 'lake-starter',
      },
    }
    migrated.version = 7
  }
  if (migrated.version < 8) {
    migrated.gearByLocation = {
      ...migrated.gearByLocation,
      'gulf-coast': {
        ownedRods: ['inshore-starter'],
        equippedRod: 'inshore-starter',
      },
    }
    migrated.version = 8
  }
  if (migrated.version < 9) {
    migrated.dayCycle = { homeElapsedMs: 0, activeTrip: null }
    migrated.version = 9
  }
  if (migrated.version < 10) {
    migrated.achievements = migrated.achievements || {}
    migrated.achievementProgress = migrated.achievementProgress || {}
    migrated.version = 10
  }
  if (migrated.version < 11) {
    migrated.gearByLocation = {
      ...migrated.gearByLocation,
      'open-gulf': {
        ownedRods: ['offshore-starter'],
        equippedRod: 'offshore-starter',
      },
    }
    migrated.version = 11
  }
  if (migrated.version < 12) {
    migrated.cabin = defaultCabin()
    migrated.version = 12
  }
  if (migrated.version < 13) {
    migrated.weather = defaultWeather()
    migrated.version = 13
  }
  if (migrated.version < 14) {
    migrated.cabin = { ...defaultCabin(), ...(migrated.cabin || {}), featuredFishId: null, specimens: {} }
    migrated.version = 14
  }
  if (migrated.version < 15) {
    migrated.cabin = { ...defaultCabin(), ...(migrated.cabin || {}) }
    migrated.achievementProgress = { ...(migrated.achievementProgress || {}), legendaryLocations: [] }
    migrated.version = 15
  }
  if (migrated.version < 16) {
    migrated.achievementProgress = { ...(migrated.achievementProgress || {}), paintingsEarned: [], masterFramesEarned: [], upgradedSouvenirs: [], equipmentPlaques: [], amazingPhotos: [], legendaryMiniatures: [] }
    migrated.version = 16
  }
  if (migrated.version < 17) {
    migrated.coinStore = { ownedItemIds: [] }
    migrated.version = 17
  }
  if (migrated.version < 18) {
    migrated.cabin = { ...defaultCabin(), ...(migrated.cabin || {}), decorByCabin: {} }
    migrated.version = 18
  }
  if (migrated.version < 19) {
    const renameTier = (item) => item && ({ ...item, sizeTier: item.sizeTier === 'amazing' ? 'trophy' : item.sizeTier === 'trophy' ? 'great' : item.sizeTier })
    migrated.inventory = Array.isArray(migrated.inventory) ? migrated.inventory.map(renameTier) : migrated.inventory
    migrated.stats = { ...(migrated.stats || {}), largestFish: renameTier(migrated.stats?.largestFish), rarestFish: renameTier(migrated.stats?.rarestFish) }
    migrated.cabin = {
      ...defaultCabin(),
      ...(migrated.cabin || {}),
      specimens: Object.fromEntries(Object.entries(migrated.cabin?.specimens || {}).map(([id, record]) => [id, { ...renameTier(record), mounted: renameTier(record?.mounted) }])),
    }
    migrated.version = 19
  }
  if (migrated.version < 20) {
    migrated.watercraft = { ownedBoatIds: [] }
    migrated.fishingSetupByLocation = { 'great-lake': { areaId: 'great-lake-shore', lureId: 'spoon' } }
    migrated.version = 20
  }
  if (migrated.version < 21) {
    migrated.tackle = { ownedLureIds: [] }
    migrated.fishingSetupByLocation = { ...defaultFishingSetups(), ...(migrated.fishingSetupByLocation || {}) }
    migrated.version = 21
  }
  if (migrated.version < 22) {
    migrated.fishingSetupByLocation = { ...defaultFishingSetups(), ...(migrated.fishingSetupByLocation || {}) }
    migrated.version = 22
  }
  if (migrated.version < 23) {
    migrated.fishingSetupByLocation = { ...defaultFishingSetups(), ...(migrated.fishingSetupByLocation || {}) }
    migrated.version = 23
  }
  if (migrated.version < 24) {
    migrated.commerce = { entitlementIds: [] }
    migrated.version = 24
  }
  if (migrated.version < 25) {
    migrated.watercraft = { ...(migrated.watercraft || {}), cosmeticByBoat: {} }
    migrated.version = 25
  }
  if (migrated.version < 26) {
    migrated.cabin = { ...defaultCabin(), ...(migrated.cabin || {}), trophyRoomFeaturedFishIds: Array(12).fill(null) }
    migrated.version = 26
  }
  if (migrated.version < 27) migrated.version = 27
  if (migrated.version < 28) {
    migrated.activities = defaultActivities()
    migrated.version = 28
  }
  return migrated
}

const validNumber = (value, fallback) =>
  Number.isFinite(value) && value >= 0 ? value : fallback

export function validateSave(input) {
  const base = newGame()
  const raw = migrateSave(input)
  if (!raw || typeof raw !== 'object') return base

  const validFish = new Set(fish.map((item) => item.id))
  const validCoinStoreIds = new Set(coinStoreItems.map((item) => item.id))
  const ownedItemIds = Array.isArray(raw.coinStore?.ownedItemIds)
    ? [...new Set(raw.coinStore.ownedItemIds.filter((id) => validCoinStoreIds.has(id)))]
    : []
  const validBoatIds = new Set(boats.map((boat) => boat.id))
  const ownedBoatIds = Array.isArray(raw.watercraft?.ownedBoatIds) ? [...new Set(raw.watercraft.ownedBoatIds.filter((id) => validBoatIds.has(id)))] : []
  const entitlementIds = Array.isArray(raw.commerce?.entitlementIds) ? [...new Set(raw.commerce.entitlementIds.filter((id) => knownEntitlementIds.includes(id)))] : []
  const cosmeticByBoat = Object.fromEntries(boats.map((boat) => {
    const cosmetic = boatCosmetics.find((item) => item.id === raw.watercraft?.cosmeticByBoat?.[boat.id] && item.boatId === boat.id)
    const allowed = cosmetic && (cosmetic.included || (ownedBoatIds.includes(boat.id) && entitlementIds.includes(cosmetic.entitlementId)))
    return [boat.id, allowed ? cosmetic.id : getDefaultBoatCosmetic(boat.id)?.id || null]
  }))
  const purchasableLureIds = new Set(lureFamilies.filter((lure) => !lure.included).map((lure) => lure.id))
  const ownedLureIds = Array.isArray(raw.tackle?.ownedLureIds) ? [...new Set(raw.tackle.ownedLureIds.filter((id) => purchasableLureIds.has(id)))] : []
  const fishingSetupByLocation = Object.fromEntries(rodLocationIds.map((locationId) => {
    const rawSetup = raw.fishingSetupByLocation?.[locationId]
    const defaultLure = getDefaultLure(locationId)
    const selectedLure = lureFamilies.find((lure) => lure.id === rawSetup?.lureId && lure.locationId === locationId && (lure.included || ownedLureIds.includes(lure.id)))
    const defaultArea = getAreasForLocation(locationId)[0]
    const selectedArea = fishingAreas.find((area) => area.id === rawSetup?.areaId && area.locationId === locationId)
    const boat = getBoatForLocation(locationId)
    const areaId = selectedArea && (!selectedArea.boatRequired || (boat && ownedBoatIds.includes(boat.id))) ? selectedArea.id : defaultArea?.id || null
    return [locationId, { areaId, lureId: selectedLure?.id || defaultLure.id }]
  }))
  const gearByLocation = Object.fromEntries(rodLocationIds.map((locationId) => {
    const locationRods = getRodsForLocation(locationId)
    const validRods = new Set(locationRods.map((rod) => rod.id))
    const starterId = locationRods[0].id
    const rawGear = raw.gearByLocation?.[locationId]
    const ownedRods = Array.isArray(rawGear?.ownedRods)
      ? [...new Set(rawGear.ownedRods.filter((id) => validRods.has(id)))]
      : [starterId]
    if (!ownedRods.includes(starterId)) ownedRods.unshift(starterId)
    const equippedRod = ownedRods.includes(rawGear?.equippedRod)
      ? rawGear.equippedRod
      : starterId
    return [locationId, { ownedRods, equippedRod }]
  }))

  const reactionWindow = Object.hasOwn(GAME_CONFIG.reactionWindows, raw.settings?.reactionWindow)
    ? raw.settings.reactionWindow
    : base.settings.reactionWindow

  const stats = raw.stats && typeof raw.stats === 'object' ? raw.stats : {}
  const tripDuration = GAME_CONFIG.dayCycle.phaseMs * GAME_CONFIG.dayCycle.phases.length * GAME_CONFIG.dayCycle.tripDays
  const rawTrip = raw.dayCycle?.activeTrip
  const activeTrip = rawTrip && rodLocationIds.includes(rawTrip.locationId) && rawTrip.locationId !== 'willow-pond'
    ? {
        locationId: rawTrip.locationId,
        elapsedMs: Math.min(validNumber(rawTrip.elapsedMs, 0), tripDuration),
        remainingMs: Math.min(validNumber(rawTrip.remainingMs, tripDuration), tripDuration),
      }
    : null
  const seenCatchIds = new Set()
  const inventory = Array.isArray(raw.inventory)
    ? raw.inventory.filter((item) => {
        const valid =
          item &&
          validFish.has(item.fishId) &&
          typeof item.catchId === 'string' &&
          !seenCatchIds.has(item.catchId) &&
          Number.isFinite(item.weight) &&
          item.weight > 0 &&
          Number.isFinite(item.value) &&
          item.value >= 0
        if (valid) seenCatchIds.add(item.catchId)
        return valid
      }).map((item) => ({
        ...item,
        sizeTier: item.sizeTier
          ? getWeightTier(item.sizeTier).id
          : classifyStoredCatch(item),
      }))
    : []
  const collection = Object.fromEntries(
    Object.entries(raw.collection && typeof raw.collection === 'object' ? raw.collection : {})
      .filter(([fishId, record]) =>
        validFish.has(fishId) &&
        record &&
        Number.isFinite(record.count) &&
        record.count > 0 &&
        Number.isFinite(record.largestWeight) &&
        record.largestWeight > 0,
      )
      .map(([fishId, record]) => [fishId, {
        count: Math.floor(record.count),
        largestWeight: record.largestWeight,
      }]),
  )

  const locationIds = new Set(locations.map((location) => location.id))
  const phases = new Set(GAME_CONFIG.dayCycle.phases.map((phase) => phase.id))
  const discoveredLocations = locations.filter((location) => location.fishIds.some((id) => collection[id])).map((location) => location.id)
  const progress = raw.achievementProgress && typeof raw.achievementProgress === 'object' ? raw.achievementProgress : {}
  const validList = (value, valid) => Array.isArray(value) ? [...new Set(value.filter((item) => valid.has(item)))] : []
  const peakMoments = Array.isArray(progress.peakMoments)
    ? progress.peakMoments.filter((entry) => entry && validFish.has(entry.fishId) && phases.has(entry.phase)).map((entry) => ({ fishId: entry.fishId, phase: entry.phase }))
    : []
  const validAchievementIds = new Set(achievementDefinitions.map((achievement) => achievement.id))
  const achievementRecords = Object.fromEntries(Object.entries(raw.achievements && typeof raw.achievements === 'object' ? raw.achievements : {})
    .filter(([id, record]) => validAchievementIds.has(id) && record && Number.isFinite(record.unlockedAt) && record.unlockedAt > 0)
    .map(([id, record]) => [id, { unlockedAt: record.unlockedAt }]))
  const rawCabin = raw.cabin && typeof raw.cabin === 'object' ? raw.cabin : {}
  const visitedLocationIds = new Set(['willow-pond', ...validList(progress.locationsFished, locationIds)])
  const provenLegendaryLocations = locations
    .filter((location) => location.fishIds.some((fishId) => collection[fishId] && fish.find((item) => item.id === fishId)?.rarity === 'legendary'))
    .map((location) => location.id)
  const legendaryLocations = [...new Set([...provenLegendaryLocations, ...validList(progress.legendaryLocations, locationIds)])]
  const paintingsEarned = validList(progress.paintingsEarned, locationIds)
  const masterFramesEarned = validList(progress.masterFramesEarned, locationIds)
  const upgradedSouvenirs = validList(progress.upgradedSouvenirs, locationIds)
  const equipmentPlaques = validList(progress.equipmentPlaques, locationIds)
  const amazingPhotos = validList(progress.amazingPhotos, validFish)
  const legendaryMiniatures = validList(progress.legendaryMiniatures, validFish)
  const eligibleInventory = inventory.filter((item) => ['great', 'trophy'].includes(item.sizeTier))
  const rawSpecimens = rawCabin.specimens && typeof rawCabin.specimens === 'object' ? rawCabin.specimens : {}
  const specimens = {}
  fish.forEach((fishItem) => {
    const rawRecord = rawSpecimens[fishItem.id]
    const inventoryBest = eligibleInventory.filter((item) => item.fishId === fishItem.id).sort((a, b) => b.weight - a.weight)[0]
    const validCandidate = rawRecord && Number.isFinite(rawRecord.weight) && rawRecord.weight > 0 && ['great', 'trophy'].includes(rawRecord.sizeTier)
    const candidate = validCandidate ? rawRecord : inventoryBest
    if (!candidate) return
    const mounted = rawRecord?.mounted && Number.isFinite(rawRecord.mounted.weight) && rawRecord.mounted.weight > 0 && ['great', 'trophy'].includes(rawRecord.mounted.sizeTier)
      ? {
          weight: rawRecord.mounted.weight,
          sizeTier: rawRecord.mounted.sizeTier,
          locationId: locationIds.has(rawRecord.mounted.locationId) ? rawRecord.mounted.locationId : 'willow-pond',
          phase: phases.has(rawRecord.mounted.phase) ? rawRecord.mounted.phase : 'morning',
          caughtAt: typeof rawRecord.mounted.caughtAt === 'string' ? rawRecord.mounted.caughtAt : null,
          preservedAt: Number.isFinite(rawRecord.mounted.preservedAt) ? rawRecord.mounted.preservedAt : Date.now(),
        }
      : null
    const best = inventoryBest && inventoryBest.weight > candidate.weight ? inventoryBest : candidate
    specimens[fishItem.id] = {
      fishId: fishItem.id,
      weight: best.weight,
      sizeTier: best.sizeTier,
      locationId: locationIds.has(best.locationId) ? best.locationId : 'willow-pond',
      phase: phases.has(best.phase) ? best.phase : 'morning',
      caughtAt: typeof best.caughtAt === 'string' ? best.caughtAt : null,
      mounted,
    }
  })
  const ownedCabinIds = new Set(coinStoreItems.filter((item) => item.cabinId && ownedItemIds.includes(item.id)).map((item) => item.cabinId))
  const premiumCabinOwned = (styleId) => {
    const definition = cabinCatalog.find((cabin) => cabin.id === styleId)
    return definition?.acquisition.type === 'store' && hasProductEntitlement(entitlementIds, definition.acquisition.productId)
  }
  const validCabinStyle = rawCabin.styleId === 'starter'
    || (rawCabin.styleId === 'angler-lodge' && legendaryLocations.length >= 4)
    || ownedCabinIds.has(rawCabin.styleId)
    || premiumCabinOwned(rawCabin.styleId)
  const decorState = {
    ...base,
    coinStore: { ownedItemIds },
    commerce: { entitlementIds },
    watercraft: { ownedBoatIds, cosmeticByBoat },
    tackle: { ownedLureIds },
    fishingSetupByLocation,
    achievementProgress: { ...base.achievementProgress, paintingsEarned, upgradedSouvenirs, equipmentPlaques, amazingPhotos, legendaryMiniatures },
  }
  const availableDecor = new Map(getCabinDecor(decorState).filter((item) => isDecorOwned(decorState, item)).map((item) => [item.id, item]))
  const rawDecorByCabin = rawCabin.decorByCabin && typeof rawCabin.decorByCabin === 'object' ? rawCabin.decorByCabin : {}
  const decorByCabin = Object.fromEntries(cabinCatalog.filter((definition) => definition.customizationHooks).map((definition) => {
    const rawSelections = rawDecorByCabin[definition.id] && typeof rawDecorByCabin[definition.id] === 'object' ? rawDecorByCabin[definition.id] : {}
    const selections = Object.fromEntries(definition.customizationHooks.map((hook) => {
      const rawSelection = rawSelections[hook.id]
      if (hook.type === 'frame') {
        const legacyDecor = typeof rawSelection === 'string' ? availableDecor.get(rawSelection) : null
        const artwork = availableDecor.get(typeof rawSelection === 'object' ? rawSelection?.artworkId : legacyDecor?.frameRole === 'artwork' ? rawSelection : null)
        const frame = availableDecor.get(typeof rawSelection === 'object' ? rawSelection?.frameId : legacyDecor?.frameRole === 'treatment' ? rawSelection : null)
        return [hook.id, {
          artworkId: artwork?.hookType === 'frame' && artwork.frameRole === 'artwork' ? artwork.id : null,
          frameId: frame?.hookType === 'frame' && frame.frameRole === 'treatment' ? frame.id : null,
        }]
      }
      const decor = availableDecor.get(rawSelection)
      return [hook.id, isDecorCompatible(hook, decor) ? decor.id : null]
    }))
    return [definition.id, selections]
  }))
  const cabin = {
    styleId: validCabinStyle ? rawCabin.styleId : 'starter',
    featuredFishId: validFish.has(rawCabin.featuredFishId) && specimens[rawCabin.featuredFishId]?.mounted ? rawCabin.featuredFishId : null,
    lodgeFeaturedFishIds: Array.isArray(rawCabin.lodgeFeaturedFishIds)
      ? [...rawCabin.lodgeFeaturedFishIds.slice(0, 3), null, null, null].slice(0, 3).map((id) => validFish.has(id) && specimens[id]?.mounted ? id : null)
      : base.cabin.lodgeFeaturedFishIds,
    trophyRoomFeaturedFishIds: Array.isArray(rawCabin.trophyRoomFeaturedFishIds)
      ? (() => {
          const seen = new Set()
          return [...rawCabin.trophyRoomFeaturedFishIds.slice(0, 12), ...Array(12).fill(null)].slice(0, 12).map((id) => {
            if (!validFish.has(id) || !specimens[id]?.mounted || seen.has(id)) return null
            seen.add(id)
            return id
          })
        })()
      : base.cabin.trophyRoomFeaturedFishIds,
    souvenirLocationId: visitedLocationIds.has(rawCabin.souvenirLocationId) ? rawCabin.souvenirLocationId : base.cabin.souvenirLocationId,
    specimens,
    decorByCabin,
  }
  const rawWeather = raw.weather && typeof raw.weather === 'object' ? raw.weather : {}
  const rainRemainingMs = Math.min(validNumber(rawWeather.rainRemainingMs, 0), GAME_CONFIG.weather.maxRainDurationMs)
  const weather = {
    nextRainMs: rainRemainingMs
      ? 0
      : Math.min(validNumber(rawWeather.nextRainMs, base.weather.nextRainMs), GAME_CONFIG.weather.maxRainIntervalMs),
    rainRemainingMs,
  }

  const validated = {
    ...base,
    version: CURRENT_VERSION,
    coins: Math.floor(validNumber(raw.coins, base.coins)),
    inventory,
    gearByLocation,
    collection,
    coinStore: { ownedItemIds },
    commerce: { entitlementIds },
    watercraft: { ownedBoatIds, cosmeticByBoat },
    tackle: { ownedLureIds },
    fishingSetupByLocation,
    cabin,
    weather,
    dayCycle: {
      homeElapsedMs: validNumber(raw.dayCycle?.homeElapsedMs, 0),
      activeTrip: activeTrip?.remainingMs > 0 ? activeTrip : null,
    },
    activities: validateActivities(raw.activities),
    achievements: achievementRecords,
    achievementProgress: {
      locationsFished: [...new Set(['willow-pond', ...discoveredLocations, ...validList(progress.locationsFished, locationIds)])],
      locationsCaught: [...new Set([...discoveredLocations, ...validList(progress.locationsCaught, locationIds)])],
      phasesCaught: validList(progress.phasesCaught, phases),
      peakMoments,
      completedTrips: validList(progress.completedTrips, locationIds).filter((id) => id !== 'willow-pond'),
      legendaryLocations,
      paintingsEarned,
      masterFramesEarned,
      upgradedSouvenirs,
      equipmentPlaques,
      amazingPhotos,
      legendaryMiniatures,
      amazingLegendaryCaught: progress.amazingLegendaryCaught === true || inventory.some((item) => item.rarity === 'legendary' && item.sizeTier === 'trophy'),
    },
    settings: {
      reactionWindow,
      soundEnabled: raw.settings?.soundEnabled !== false,
      hapticsEnabled: raw.settings?.hapticsEnabled !== false,
      ambienceEnabled: raw.settings?.ambienceEnabled === true,
    },
    stats: {
      ...base.stats,
      ...stats,
      totalCaught: Math.floor(validNumber(stats.totalCaught, 0)),
      totalCoinsEarned: Math.floor(validNumber(stats.totalCoinsEarned, 0)),
      totalCasts: Math.floor(validNumber(stats.totalCasts, 0)),
      escaped: Math.floor(validNumber(stats.escaped, 0)),
      quietCasts: Math.floor(validNumber(stats.quietCasts, 0)),
    },
  }
  return unlockAchievements(unlockLocationCosmetics(validated)).state
}

const applyLocalhostCoinGrant = (game) => {
  const hostname = globalThis.location?.hostname
  if (!['localhost', '127.0.0.1'].includes(hostname) || localStorage.getItem(LOCALHOST_COIN_GRANT_KEY)) return game
  const granted = { ...game, coins: game.coins + 1000000 }
  localStorage.setItem(LOCALHOST_COIN_GRANT_KEY, 'granted')
  localStorage.setItem(SAVE_KEY, JSON.stringify(granted))
  return granted
}

export function loadGame() {
  const serialized = localStorage.getItem(SAVE_KEY)
  if (!serialized) return { game: applyLocalhostCoinGrant(newGame()), notice: null }

  try {
    return { game: applyLocalhostCoinGrant(validateSave(JSON.parse(serialized))), notice: null }
  } catch {
    try {
      localStorage.setItem(RECOVERY_KEY, serialized)
    } catch {
      // Recovery storage can fail in private browsing; the game can still start.
    }
    return {
      game: newGame(),
      notice: 'We could not read your previous save. A recovery copy was kept when storage allowed.',
    }
  }
}

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearGame() {
  try {
    localStorage.removeItem(SAVE_KEY)
    localStorage.removeItem(RECOVERY_KEY)
  } catch {
    // The in-memory reset still works if storage is unavailable.
  }
}

export const rarityRank = (rarity) => Math.max(0, rarityOrder.indexOf(rarity))
