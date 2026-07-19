import { GAME_CONFIG } from '../data/config'
import { fish } from '../data/fish'
import { getRodsForLocation, getStarterRod, rodLocationIds } from '../data/rods'
import { classifyStoredCatch, getWeightTier } from '../utils/valueCalculator'

const SAVE_KEY = 'fishing-adventure-save-v1'
const RECOVERY_KEY = 'fishing-adventure-recovery-v1'
const CURRENT_VERSION = 9
const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary']

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
  dayCycle: { homeElapsedMs: 0, activeTrip: null },
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

  return {
    ...base,
    version: CURRENT_VERSION,
    coins: Math.floor(validNumber(raw.coins, base.coins)),
    inventory,
    gearByLocation,
    collection,
    dayCycle: {
      homeElapsedMs: validNumber(raw.dayCycle?.homeElapsedMs, 0),
      activeTrip: activeTrip?.remainingMs > 0 ? activeTrip : null,
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
