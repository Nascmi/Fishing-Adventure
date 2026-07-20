import { GAME_CONFIG } from '../data/config'
import { fish } from '../data/fish'
import { getRodsForLocation, getStarterRod, rodLocationIds } from '../data/rods'
import { classifyStoredCatch, getWeightTier } from '../utils/valueCalculator'
import { achievements as achievementDefinitions, unlockAchievements } from '../data/achievements'
import { locations } from '../data/locations'

const SAVE_KEY = 'fishing-adventure-save-v1'
const RECOVERY_KEY = 'fishing-adventure-recovery-v1'
const CURRENT_VERSION = 15
const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary']
const defaultCabin = () => ({
  styleId: 'starter',
  featuredFishId: null,
  lodgeFeaturedFishIds: [null, null, null],
  souvenirLocationId: 'willow-pond',
  specimens: {},
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
  cabin: defaultCabin(),
  weather: defaultWeather(),
  dayCycle: { homeElapsedMs: 0, activeTrip: null },
  achievements: {},
  achievementProgress: {
    locationsFished: ['willow-pond'],
    locationsCaught: [],
    phasesCaught: [],
    peakMoments: [],
    completedTrips: [],
    legendaryLocations: [],
    amazingLegendaryCaught: false,
  },
  settings: { reactionWindow: 'relaxed', soundEnabled: true, hapticsEnabled: true, ambienceEnabled: false },
  stats: {
    totalCaught: 0,
    totalCoinsEarned: 0,
    totalCasts: 0,
    escaped: 0,
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
  return migrated
}

const validNumber = (value, fallback) =>
  Number.isFinite(value) && value >= 0 ? value : fallback

export function validateSave(input) {
  const base = newGame()
  const raw = migrateSave(input)
  if (!raw || typeof raw !== 'object') return base

  const validFish = new Set(fish.map((item) => item.id))
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
  const eligibleInventory = inventory.filter((item) => ['trophy', 'amazing'].includes(item.sizeTier))
  const rawSpecimens = rawCabin.specimens && typeof rawCabin.specimens === 'object' ? rawCabin.specimens : {}
  const specimens = {}
  fish.forEach((fishItem) => {
    const rawRecord = rawSpecimens[fishItem.id]
    const inventoryBest = eligibleInventory.filter((item) => item.fishId === fishItem.id).sort((a, b) => b.weight - a.weight)[0]
    const validCandidate = rawRecord && Number.isFinite(rawRecord.weight) && rawRecord.weight > 0 && ['trophy', 'amazing'].includes(rawRecord.sizeTier)
    const candidate = validCandidate ? rawRecord : inventoryBest
    if (!candidate) return
    const mounted = rawRecord?.mounted && Number.isFinite(rawRecord.mounted.weight) && rawRecord.mounted.weight > 0 && ['trophy', 'amazing'].includes(rawRecord.mounted.sizeTier)
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
  const cabin = {
    styleId: rawCabin.styleId === 'angler-lodge' && legendaryLocations.length >= 4 ? 'angler-lodge' : 'starter',
    featuredFishId: validFish.has(rawCabin.featuredFishId) && specimens[rawCabin.featuredFishId]?.mounted ? rawCabin.featuredFishId : null,
    lodgeFeaturedFishIds: Array.isArray(rawCabin.lodgeFeaturedFishIds)
      ? [...rawCabin.lodgeFeaturedFishIds.slice(0, 3), null, null, null].slice(0, 3).map((id) => validFish.has(id) && specimens[id]?.mounted ? id : null)
      : base.cabin.lodgeFeaturedFishIds,
    souvenirLocationId: visitedLocationIds.has(rawCabin.souvenirLocationId) ? rawCabin.souvenirLocationId : base.cabin.souvenirLocationId,
    specimens,
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
    cabin,
    weather,
    dayCycle: {
      homeElapsedMs: validNumber(raw.dayCycle?.homeElapsedMs, 0),
      activeTrip: activeTrip?.remainingMs > 0 ? activeTrip : null,
    },
    achievements: achievementRecords,
    achievementProgress: {
      locationsFished: [...new Set(['willow-pond', ...discoveredLocations, ...validList(progress.locationsFished, locationIds)])],
      locationsCaught: [...new Set([...discoveredLocations, ...validList(progress.locationsCaught, locationIds)])],
      phasesCaught: validList(progress.phasesCaught, phases),
      peakMoments,
      completedTrips: validList(progress.completedTrips, locationIds).filter((id) => id !== 'willow-pond'),
      legendaryLocations,
      amazingLegendaryCaught: progress.amazingLegendaryCaught === true || inventory.some((item) => item.rarity === 'legendary' && item.sizeTier === 'amazing'),
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
    },
  }
  return unlockAchievements(validated).state
}

export function loadGame() {
  const serialized = localStorage.getItem(SAVE_KEY)
  if (!serialized) return { game: newGame(), notice: null }

  try {
    return { game: validateSave(JSON.parse(serialized)), notice: null }
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
