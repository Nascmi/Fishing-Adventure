import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { clearGame, loadGame, newGame, rarityRank, saveGame } from '../services/saveService'
import { getRod } from '../data/rods'
import { GAME_CONFIG } from '../data/config'
import { getLocation } from '../data/locations'
import { achievements as achievementDefinitions, unlockAchievements } from '../data/achievements'
import { getPreferredPhases } from '../utils/fishingEngine'

const GameContext = createContext(null)
const randomBetween = (minimum, maximum) => Math.round(minimum + Math.random() * (maximum - minimum))

const advanceWeather = (weather, delta) => {
  if (weather.rainRemainingMs > 0) {
    const rainRemainingMs = Math.max(0, weather.rainRemainingMs - delta)
    return rainRemainingMs
      ? { ...weather, rainRemainingMs }
      : {
          nextRainMs: randomBetween(GAME_CONFIG.weather.minRainIntervalMs, GAME_CONFIG.weather.maxRainIntervalMs),
          rainRemainingMs: 0,
        }
  }

  const nextRainMs = weather.nextRainMs - delta
  if (nextRainMs > 0) return { ...weather, nextRainMs }
  return {
    nextRainMs: 0,
    rainRemainingMs: randomBetween(GAME_CONFIG.weather.minRainDurationMs, GAME_CONFIG.weather.maxRainDurationMs),
  }
}

export function GameProvider({ children }) {
  const [initial] = useState(loadGame)
  const [game, setGame] = useState(initial.game)
  const [notice, setNotice] = useState(initial.notice)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const knownAchievements = useRef(new Set(Object.keys(initial.game.achievements)))

  useEffect(() => {
    setStorageAvailable(saveGame(game))
  }, [game])

  useEffect(() => {
    const newIds = Object.keys(game.achievements).filter((id) => !knownAchievements.current.has(id))
    if (!newIds.length) return
    newIds.forEach((id) => knownAchievements.current.add(id))
    const names = newIds.map((id) => achievementDefinitions.find((item) => item.id === id)?.name).filter(Boolean)
    setNotice(names.length === 1 ? `Angling Keepsake earned: ${names[0]}` : `${names.length} Angling Keepsakes earned.`)
  }, [game.achievements])

  const actions = useMemo(
    () => ({
      recordCast: () =>
        setGame((current) => unlockAchievements({
          ...current,
          stats: { ...current.stats, totalCasts: current.stats.totalCasts + 1 },
        }).state),
      recordEscape: () =>
        setGame((current) => ({
          ...current,
          stats: { ...current.stats, escaped: current.stats.escaped + 1 },
        })),
      addCatch: (item, locationId, phase) =>
        setGame((current) => {
          const previous = current.collection[item.fishId] || { count: 0, largestWeight: 0 }
          const largest =
            !current.stats.largestFish || item.weight > current.stats.largestFish.weight
              ? item
              : current.stats.largestFish
          const rarest =
            !current.stats.rarestFish ||
            rarityRank(item.rarity) > rarityRank(current.stats.rarestFish.rarity)
              ? item
              : current.stats.rarestFish
          const isPeak = getPreferredPhases(item.fishId).includes(phase)
          const previousSpecimen = current.cabin.specimens[item.fishId]
          const isEligibleSpecimen = ['trophy', 'amazing'].includes(item.sizeTier)
          const isBetterSpecimen = isEligibleSpecimen && (!previousSpecimen || item.weight > previousSpecimen.weight)
          const next = {
            ...current,
            inventory: [item, ...current.inventory],
            collection: {
              ...current.collection,
              [item.fishId]: {
                count: previous.count + 1,
                largestWeight: Math.max(previous.largestWeight, item.weight),
              },
            },
            stats: {
              ...current.stats,
              totalCaught: current.stats.totalCaught + 1,
              largestFish: largest,
              rarestFish: rarest,
            },
            achievementProgress: {
              ...current.achievementProgress,
              locationsCaught: [...new Set([...current.achievementProgress.locationsCaught, locationId])],
              phasesCaught: [...new Set([...current.achievementProgress.phasesCaught, phase])],
              peakMoments: isPeak && !current.achievementProgress.peakMoments.some((entry) => entry.fishId === item.fishId && entry.phase === phase)
                ? [...current.achievementProgress.peakMoments, { fishId: item.fishId, phase }]
                : current.achievementProgress.peakMoments,
              amazingLegendaryCaught: current.achievementProgress.amazingLegendaryCaught || (item.rarity === 'legendary' && item.sizeTier === 'amazing'),
            },
            cabin: isBetterSpecimen ? {
              ...current.cabin,
              specimens: {
                ...current.cabin.specimens,
                [item.fishId]: { fishId: item.fishId, weight: item.weight, sizeTier: item.sizeTier, locationId, phase, caughtAt: item.caughtAt, mounted: previousSpecimen?.mounted || null },
              },
            } : current.cabin,
          }
          return unlockAchievements(next).state
        }),
      sell: (id) =>
        setGame((current) => {
          const item = current.inventory.find((catchItem) => catchItem.catchId === id)
          if (!item) return current
          const next = {
            ...current,
            coins: current.coins + item.value,
            inventory: current.inventory.filter((catchItem) => catchItem.catchId !== id),
            stats: {
              ...current.stats,
              totalCoinsEarned: current.stats.totalCoinsEarned + item.value,
            },
          }
          return next
        }),
      sellAll: () =>
        setGame((current) => {
          const total = current.inventory.reduce((sum, item) => sum + item.value, 0)
          if (!total) return current
          return {
            ...current,
            coins: current.coins + total,
            inventory: [],
            stats: {
              ...current.stats,
              totalCoinsEarned: current.stats.totalCoinsEarned + total,
            },
          }
        }),
      buyRod: (id, locationId) =>
        setGame((current) => {
          const rod = getRod(id, locationId)
          const gear = current.gearByLocation[locationId]
          if (!gear || rod.id !== id || rod.locationId !== locationId || gear.ownedRods.includes(id) || current.coins < rod.price) return current
          if (rod.previousId && !gear.ownedRods.includes(rod.previousId)) return current
          return {
            ...current,
            coins: current.coins - rod.price,
            gearByLocation: {
              ...current.gearByLocation,
              [locationId]: { ...gear, ownedRods: [...gear.ownedRods, id] },
            },
          }
        }),
      equipRod: (id, locationId) =>
        setGame((current) =>
          current.gearByLocation[locationId]?.ownedRods.includes(id)
            ? {
                ...current,
                gearByLocation: {
                  ...current.gearByLocation,
                  [locationId]: { ...current.gearByLocation[locationId], equippedRod: id },
                },
              }
            : current,
        ),
      bookTrip: (locationId) =>
        setGame((current) => {
          const location = getLocation(locationId)
          if (!location.tripCost || current.coins < location.tripCost) return current
          const duration = GAME_CONFIG.dayCycle.phaseMs * GAME_CONFIG.dayCycle.phases.length * GAME_CONFIG.dayCycle.tripDays
          return {
            ...current,
            coins: current.coins - location.tripCost,
            dayCycle: {
              ...current.dayCycle,
              activeTrip: { locationId, elapsedMs: 0, remainingMs: duration },
            },
            achievementProgress: {
              ...current.achievementProgress,
              locationsFished: [...new Set([...current.achievementProgress.locationsFished, locationId])],
            },
          }
          return unlockAchievements(next).state
        }),
      tickDayCycle: (locationId, deltaMs) =>
        setGame((current) => {
          const delta = Math.max(0, Math.min(deltaMs, 60000))
          if (!delta) return current
          const weather = advanceWeather(current.weather, delta)
          if (locationId === 'willow-pond') {
            return { ...current, weather, dayCycle: { ...current.dayCycle, homeElapsedMs: current.dayCycle.homeElapsedMs + delta } }
          }
          const trip = current.dayCycle.activeTrip
          if (trip?.locationId !== locationId) return { ...current, weather }
          const remainingMs = Math.max(0, trip.remainingMs - delta)
          const next = {
            ...current,
            weather,
            dayCycle: {
              ...current.dayCycle,
              activeTrip: remainingMs ? { ...trip, elapsedMs: trip.elapsedMs + delta, remainingMs } : null,
            },
            achievementProgress: remainingMs ? current.achievementProgress : {
              ...current.achievementProgress,
              completedTrips: [...new Set([...current.achievementProgress.completedTrips, trip.locationId])],
            },
          }
          return remainingMs ? next : unlockAchievements(next).state
        }),
      skipDayPhase: (locationId) =>
        setGame((current) => {
          const phaseMs = GAME_CONFIG.dayCycle.phaseMs
          const elapsed = locationId === 'willow-pond' ? current.dayCycle.homeElapsedMs : current.dayCycle.activeTrip?.elapsedMs
          if (!Number.isFinite(elapsed)) return current
          const advance = phaseMs - (elapsed % phaseMs || 0)
          if (locationId === 'willow-pond') {
            return { ...current, dayCycle: { ...current.dayCycle, homeElapsedMs: elapsed + advance } }
          }
          const trip = current.dayCycle.activeTrip
          if (trip?.locationId !== locationId) return current
          const used = Math.min(advance, trip.remainingMs)
          const remainingMs = trip.remainingMs - used
          const next = {
            ...current,
            dayCycle: {
              ...current.dayCycle,
              activeTrip: remainingMs ? { ...trip, elapsedMs: trip.elapsedMs + used, remainingMs } : null,
            },
            achievementProgress: remainingMs ? current.achievementProgress : {
              ...current.achievementProgress,
              completedTrips: [...new Set([...current.achievementProgress.completedTrips, trip.locationId])],
            },
          }
          return remainingMs ? next : unlockAchievements(next).state
        }),
      endTrip: () => setGame((current) => ({ ...current, dayCycle: { ...current.dayCycle, activeTrip: null } })),
      setReactionWindow: (reactionWindow) =>
        setGame((current) => ({
          ...current,
          settings: { ...current.settings, reactionWindow },
        })),
      setFeedbackSetting: (setting, enabled) =>
        setGame((current) => ({
          ...current,
          settings: { ...current.settings, [setting]: Boolean(enabled) },
        })),
      setCabinChoice: (slot, value) =>
        setGame((current) => ({
          ...current,
          cabin: { ...current.cabin, [slot]: value },
        })),
      preserveSpecimen: (fishId) =>
        setGame((current) => {
          const specimen = current.cabin.specimens[fishId]
          if (!specimen) return current
          const isUpgrade = Boolean(specimen.mounted)
          if (isUpgrade && specimen.weight <= specimen.mounted.weight) return current
          if (!isUpgrade && current.coins < GAME_CONFIG.trophyPreservationCost) return current
          const mounted = { weight: specimen.weight, sizeTier: specimen.sizeTier, locationId: specimen.locationId, phase: specimen.phase, caughtAt: specimen.caughtAt, preservedAt: Date.now() }
          return {
            ...current,
            coins: isUpgrade ? current.coins : current.coins - GAME_CONFIG.trophyPreservationCost,
            cabin: { ...current.cabin, featuredFishId: fishId, specimens: { ...current.cabin.specimens, [fishId]: { ...specimen, mounted } } },
          }
        }),
      dismissNotice: () => setNotice(null),
      reset: () => {
        clearGame()
        knownAchievements.current.clear()
        setNotice(null)
        setGame(newGame())
      },
    }),
    [],
  )

  return (
    <GameContext.Provider value={{ game, actions, notice, storageAvailable }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
