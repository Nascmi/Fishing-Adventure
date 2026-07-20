import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { clearGame, loadGame, newGame, rarityRank, saveGame } from '../services/saveService'
import { achievements as achievementDefinitions, unlockAchievements } from '../data/achievements'
import { getPreferredPhases } from '../utils/fishingEngine'
import { unlockLocationCosmetics } from '../data/locationPaintings'
import { chooseCabinDecor, chooseCabinStyle, endActiveTrip, equipOwnedRod, preserveCabinSpecimen, purchaseCoinStoreItem, purchaseRod, skipTimePhase, startTrip, tickGameTime } from '../game/gameRules'

const GameContext = createContext(null)
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
              legendaryLocations: item.rarity === 'legendary'
                ? [...new Set([...current.achievementProgress.legendaryLocations, locationId])]
                : current.achievementProgress.legendaryLocations,
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
          return unlockAchievements(unlockLocationCosmetics(next)).state
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
      buyRod: (id, locationId) => setGame((current) => purchaseRod(current, id, locationId)),
      buyCoinStoreItem: (id) => setGame((current) => purchaseCoinStoreItem(current, id)),
      equipRod: (id, locationId) => setGame((current) => equipOwnedRod(current, id, locationId)),
      bookTrip: (locationId) => setGame((current) => startTrip(current, locationId)),
      tickDayCycle: (locationId, deltaMs) => setGame((current) => tickGameTime(current, locationId, deltaMs)),
      skipDayPhase: (locationId) => setGame((current) => skipTimePhase(current, locationId)),
      endTrip: () => setGame(endActiveTrip),
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
      setLodgeDisplay: (index, fishId) =>
        setGame((current) => {
          if (current.achievementProgress.legendaryLocations.length < 4 || index < 0 || index > 2) return current
          const nextDisplays = [...current.cabin.lodgeFeaturedFishIds]
          nextDisplays[index] = fishId || null
          return { ...current, cabin: { ...current.cabin, lodgeFeaturedFishIds: nextDisplays } }
        }),
      setCabinStyle: (styleId) => setGame((current) => chooseCabinStyle(current, styleId)),
      setCabinDecor: (cabinId, hookId, decorId) => setGame((current) => chooseCabinDecor(current, cabinId, hookId, decorId)),
      preserveSpecimen: (fishId) => setGame((current) => preserveCabinSpecimen(current, fishId)),
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
