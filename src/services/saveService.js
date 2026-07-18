import { GAME_CONFIG } from '../data/config'
import { fish } from '../data/fish'
import { rods } from '../data/rods'
import { classifyStoredCatch, getWeightTier } from '../utils/valueCalculator'

const SAVE_KEY = 'fishing-adventure-save-v1'
const RECOVERY_KEY = 'fishing-adventure-recovery-v1'
const CURRENT_VERSION = 5
const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary']

export const newGame = () => ({
  version: CURRENT_VERSION,
  coins: GAME_CONFIG.startingCoins,
  inventory: [],
  ownedRods: ['old'],
  equippedRod: 'old',
  collection: {},
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
  return migrated
}

const validNumber = (value, fallback) =>
  Number.isFinite(value) && value >= 0 ? value : fallback

export function validateSave(input) {
  const base = newGame()
  const raw = migrateSave(input)
  if (!raw || typeof raw !== 'object') return base

  const validFish = new Set(fish.map((item) => item.id))
  const validRods = new Set(rods.map((rod) => rod.id))
  const ownedRods = Array.isArray(raw.ownedRods)
    ? [...new Set(raw.ownedRods.filter((id) => validRods.has(id)))]
    : [...base.ownedRods]
  if (!ownedRods.includes('old')) ownedRods.unshift('old')

  const reactionWindow = Object.hasOwn(GAME_CONFIG.reactionWindows, raw.settings?.reactionWindow)
    ? raw.settings.reactionWindow
    : base.settings.reactionWindow

  const stats = raw.stats && typeof raw.stats === 'object' ? raw.stats : {}
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
    ownedRods,
    equippedRod: ownedRods.includes(raw.equippedRod) ? raw.equippedRod : 'old',
    collection,
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
