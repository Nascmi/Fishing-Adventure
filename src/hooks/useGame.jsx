import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearGame, loadGame, newGame, rarityRank, saveGame } from '../services/saveService'
import { getRod } from '../data/rods'
import { GAME_CONFIG } from '../data/config'
import { getLocation } from '../data/locations'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [initial] = useState(loadGame)
  const [game, setGame] = useState(initial.game)
  const [notice, setNotice] = useState(initial.notice)
  const [storageAvailable, setStorageAvailable] = useState(true)

  useEffect(() => {
    setStorageAvailable(saveGame(game))
  }, [game])

  const actions = useMemo(
    () => ({
      recordCast: () =>
        setGame((current) => ({
          ...current,
          stats: { ...current.stats, totalCasts: current.stats.totalCasts + 1 },
        })),
      recordEscape: () =>
        setGame((current) => ({
          ...current,
          stats: { ...current.stats, escaped: current.stats.escaped + 1 },
        })),
      addCatch: (item) =>
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
          return {
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
          }
        }),
      sell: (id) =>
        setGame((current) => {
          const item = current.inventory.find((catchItem) => catchItem.catchId === id)
          if (!item) return current
          return {
            ...current,
            coins: current.coins + item.value,
            inventory: current.inventory.filter((catchItem) => catchItem.catchId !== id),
            stats: {
              ...current.stats,
              totalCoinsEarned: current.stats.totalCoinsEarned + item.value,
            },
          }
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
          }
        }),
      tickDayCycle: (locationId, deltaMs) =>
        setGame((current) => {
          const delta = Math.max(0, Math.min(deltaMs, 60000))
          if (!delta) return current
          if (locationId === 'willow-pond') {
            return { ...current, dayCycle: { ...current.dayCycle, homeElapsedMs: current.dayCycle.homeElapsedMs + delta } }
          }
          const trip = current.dayCycle.activeTrip
          if (trip?.locationId !== locationId) return current
          const remainingMs = Math.max(0, trip.remainingMs - delta)
          return {
            ...current,
            dayCycle: {
              ...current.dayCycle,
              activeTrip: remainingMs ? { ...trip, elapsedMs: trip.elapsedMs + delta, remainingMs } : null,
            },
          }
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
          return {
            ...current,
            dayCycle: {
              ...current.dayCycle,
              activeTrip: remainingMs ? { ...trip, elapsedMs: trip.elapsedMs + used, remainingMs } : null,
            },
          }
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
      dismissNotice: () => setNotice(null),
      reset: () => {
        clearGame()
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
