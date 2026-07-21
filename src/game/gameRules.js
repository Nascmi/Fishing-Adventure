import { unlockAchievements } from '../data/achievements'
import { getCoinStoreItem } from '../data/coinStoreCatalog'
import { getCabinDefinition } from '../data/cabinCatalog'
import { getOwnedCabinDecor } from '../data/cabinDecor'
import { GAME_CONFIG } from '../data/config'
import { getLocation } from '../data/locations'
import { unlockLocationCosmetics } from '../data/locationPaintings'
import { getRod } from '../data/rods'
import { getBoat, getBoatForLocation, getFishingArea, getLureFamily } from '../data/waterSetup'

const randomBetween = (minimum, maximum, random) => Math.round(minimum + random() * (maximum - minimum))

const advanceWeather = (weather, delta, random) => {
  if (weather.rainRemainingMs > 0) {
    const rainRemainingMs = Math.max(0, weather.rainRemainingMs - delta)
    return rainRemainingMs
      ? { ...weather, rainRemainingMs }
      : {
          nextRainMs: randomBetween(GAME_CONFIG.weather.minRainIntervalMs, GAME_CONFIG.weather.maxRainIntervalMs, random),
          rainRemainingMs: 0,
        }
  }

  const nextRainMs = weather.nextRainMs - delta
  if (nextRainMs > 0) return { ...weather, nextRainMs }
  return {
    nextRainMs: 0,
    rainRemainingMs: randomBetween(GAME_CONFIG.weather.minRainDurationMs, GAME_CONFIG.weather.maxRainDurationMs, random),
  }
}

export const purchaseRod = (state, id, locationId) => {
  const rod = getRod(id, locationId)
  const gear = state.gearByLocation[locationId]
  if (!gear || rod.id !== id || rod.locationId !== locationId || gear.ownedRods.includes(id) || state.coins < rod.price) return state
  if (rod.previousId && !gear.ownedRods.includes(rod.previousId)) return state
  return unlockLocationCosmetics({
    ...state,
    coins: state.coins - rod.price,
    gearByLocation: {
      ...state.gearByLocation,
      [locationId]: { ...gear, ownedRods: [...gear.ownedRods, id] },
    },
  })
}

export const purchaseCoinStoreItem = (state, id) => {
  const item = getCoinStoreItem(id)
  if (!item || state.coinStore.ownedItemIds.includes(id) || state.coins < item.price) return state
  return {
    ...state,
    coins: state.coins - item.price,
    coinStore: { ...state.coinStore, ownedItemIds: [...state.coinStore.ownedItemIds, id] },
  }
}

export const equipOwnedRod = (state, id, locationId) =>
  state.gearByLocation[locationId]?.ownedRods.includes(id)
    ? {
        ...state,
        gearByLocation: {
          ...state.gearByLocation,
          [locationId]: { ...state.gearByLocation[locationId], equippedRod: id },
        },
      }
    : state

export const purchaseBoat = (state, id) => {
  const boat = getBoat(id)
  if (!boat || state.watercraft.ownedBoatIds.includes(id) || state.coins < boat.price) return state
  return { ...state, coins: state.coins - boat.price, watercraft: { ...state.watercraft, ownedBoatIds: [...state.watercraft.ownedBoatIds, id] } }
}

export const purchaseLure = (state, id) => {
  const lure = getLureFamily(id)
  if (!lure || lure.included || state.tackle.ownedLureIds.includes(id) || state.coins < lure.price) return state
  return { ...state, coins: state.coins - lure.price, tackle: { ...state.tackle, ownedLureIds: [...state.tackle.ownedLureIds, id] } }
}

export const chooseFishingSetup = (state, locationId, type, id) => {
  const current = state.fishingSetupByLocation[locationId]
  const lure = getLureFamily(id)
  if (type === 'lure' && lure?.locationId === locationId && (lure.included || state.tackle.ownedLureIds.includes(id))) {
    return { ...state, fishingSetupByLocation: { ...state.fishingSetupByLocation, [locationId]: { ...current, lureId: id } } }
  }
  const area = getFishingArea(id)
  const boat = getBoatForLocation(locationId)
  if (type !== 'area' || !area || area.locationId !== locationId || (area.boatRequired && (!boat || !state.watercraft.ownedBoatIds.includes(boat.id)))) return state
  if (current.areaId === id) return state
  const relocationCost = area.relocationCost || 0
  if (state.coins < relocationCost) return state
  return { ...state, coins: state.coins - relocationCost, fishingSetupByLocation: { ...state.fishingSetupByLocation, [locationId]: { ...current, areaId: id } } }
}

export const startTrip = (state, locationId, now = Date.now()) => {
  const location = getLocation(locationId)
  if (!location.tripCost || state.coins < location.tripCost) return state
  const duration = GAME_CONFIG.dayCycle.phaseMs * GAME_CONFIG.dayCycle.phases.length * GAME_CONFIG.dayCycle.tripDays
  const next = {
    ...state,
    coins: state.coins - location.tripCost,
    dayCycle: {
      ...state.dayCycle,
      activeTrip: { locationId, elapsedMs: 0, remainingMs: duration },
    },
    achievementProgress: {
      ...state.achievementProgress,
      locationsFished: [...new Set([...state.achievementProgress.locationsFished, locationId])],
    },
  }
  return unlockAchievements(next, now).state
}

export const tickGameTime = (state, locationId, deltaMs, random = Math.random, now = Date.now()) => {
  const delta = Math.max(0, Math.min(deltaMs, 60000))
  if (!delta) return state
  const weather = advanceWeather(state.weather, delta, random)
  if (locationId === 'willow-pond') {
    return { ...state, weather, dayCycle: { ...state.dayCycle, homeElapsedMs: state.dayCycle.homeElapsedMs + delta } }
  }
  const trip = state.dayCycle.activeTrip
  if (trip?.locationId !== locationId) return { ...state, weather }
  const remainingMs = Math.max(0, trip.remainingMs - delta)
  const next = {
    ...state,
    weather,
    dayCycle: {
      ...state.dayCycle,
      activeTrip: remainingMs ? { ...trip, elapsedMs: trip.elapsedMs + delta, remainingMs } : null,
    },
    achievementProgress: remainingMs ? state.achievementProgress : {
      ...state.achievementProgress,
      completedTrips: [...new Set([...state.achievementProgress.completedTrips, trip.locationId])],
    },
  }
  return remainingMs ? next : unlockAchievements(unlockLocationCosmetics(next), now).state
}

export const skipTimePhase = (state, locationId, now = Date.now()) => {
  const phaseMs = GAME_CONFIG.dayCycle.phaseMs
  const elapsed = locationId === 'willow-pond' ? state.dayCycle.homeElapsedMs : state.dayCycle.activeTrip?.elapsedMs
  if (!Number.isFinite(elapsed)) return state
  const advance = phaseMs - (elapsed % phaseMs || 0)
  if (locationId === 'willow-pond') {
    return { ...state, dayCycle: { ...state.dayCycle, homeElapsedMs: elapsed + advance } }
  }
  const trip = state.dayCycle.activeTrip
  if (trip?.locationId !== locationId) return state
  const used = Math.min(advance, trip.remainingMs)
  const remainingMs = trip.remainingMs - used
  const next = {
    ...state,
    dayCycle: {
      ...state.dayCycle,
      activeTrip: remainingMs ? { ...trip, elapsedMs: trip.elapsedMs + used, remainingMs } : null,
    },
    achievementProgress: remainingMs ? state.achievementProgress : {
      ...state.achievementProgress,
      completedTrips: [...new Set([...state.achievementProgress.completedTrips, trip.locationId])],
    },
  }
  return remainingMs ? next : unlockAchievements(unlockLocationCosmetics(next), now).state
}

export const endActiveTrip = (state) => ({ ...state, dayCycle: { ...state.dayCycle, activeTrip: null } })

export const chooseCabinStyle = (state, styleId) => {
  if (styleId === 'angler-lodge' && state.achievementProgress.legendaryLocations.length < 4) return state
  const storeCabinOwned = state.coinStore.ownedItemIds.some((id) => getCoinStoreItem(id)?.cabinId === styleId)
  if (!['starter', 'angler-lodge'].includes(styleId) && !storeCabinOwned) return state
  return { ...state, cabin: { ...state.cabin, styleId } }
}

export const chooseCabinDecor = (state, cabinId, hookId, decorId) => {
  const cabin = getCabinDefinition(cabinId)
  const hook = cabin?.customizationHooks?.find((item) => item.id === hookId)
  if (!hook) return state
  if (decorId === null) {
    return { ...state, cabin: { ...state.cabin, decorByCabin: { ...state.cabin.decorByCabin, [cabinId]: { ...state.cabin.decorByCabin[cabinId], [hookId]: null } } } }
  }
  const decor = getOwnedCabinDecor(state).find((item) => item.id === decorId)
  if (!decor || decor.hookType !== hook.type) return state
  return { ...state, cabin: { ...state.cabin, decorByCabin: { ...state.cabin.decorByCabin, [cabinId]: { ...state.cabin.decorByCabin[cabinId], [hookId]: decorId } } } }
}

export const preserveCabinSpecimen = (state, fishId, now = Date.now()) => {
  const specimen = state.cabin.specimens[fishId]
  if (!specimen) return state
  const isUpgrade = Boolean(specimen.mounted)
  if (isUpgrade && specimen.weight <= specimen.mounted.weight) return state
  if (!isUpgrade && state.coins < GAME_CONFIG.trophyPreservationCost) return state
  const mounted = { weight: specimen.weight, sizeTier: specimen.sizeTier, locationId: specimen.locationId, phase: specimen.phase, caughtAt: specimen.caughtAt, preservedAt: now }
  return {
    ...state,
    coins: isUpgrade ? state.coins : state.coins - GAME_CONFIG.trophyPreservationCost,
    cabin: { ...state.cabin, featuredFishId: fishId, specimens: { ...state.cabin.specimens, [fishId]: { ...specimen, mounted } } },
  }
}
