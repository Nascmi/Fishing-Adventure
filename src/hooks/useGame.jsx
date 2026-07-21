import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { clearGame, loadGame, newGame, rarityRank, saveGame } from '../services/saveService'
import { achievements as achievementDefinitions, unlockAchievements } from '../data/achievements'
import { getPreferredPhases } from '../utils/fishingEngine'
import { unlockLocationCosmetics } from '../data/locationPaintings'
import { chooseBoatCosmetic, chooseCabinDecor, chooseCabinStyle, chooseFishingSetup, endActiveTrip, equipOwnedRod, preserveCabinSpecimen, purchaseBoat, purchaseCoinStoreItem, purchaseLure, purchaseRod, skipTimePhase, startTrip, tickGameTime } from '../game/gameRules'
import { initializeCommerce, purchaseStoreProduct, restoreStorePurchases } from '../services/commerceService'

const GameContext = createContext(null)
export function GameProvider({ children }) {
  const [initial] = useState(loadGame)
  const [game, setGame] = useState(initial.game)
  const [notice, setNotice] = useState(initial.notice)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [commerce, setCommerce] = useState({ status: 'loading', available: false, provider: null, products: [], ownedProductIds: [], pendingProductId: null, message: null })
  const knownAchievements = useRef(new Set(Object.keys(initial.game.achievements)))

  useEffect(() => {
    setStorageAvailable(saveGame(game))
  }, [game])

  useEffect(() => {
    let active = true
    initializeCommerce().then((result) => {
      if (!active) return
      setCommerce({ status: 'ready', pendingProductId: null, message: null, ...result })
      if (result.available) setGame((current) => ({ ...current, commerce: { entitlementIds: result.entitlementIds } }))
    }).catch(() => {
      if (active) setCommerce((current) => ({ ...current, status: 'error', message: 'The store could not connect. Your saved game is safe.' }))
    })
    return () => { active = false }
  }, [])

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
      recordQuietCast: () =>
        setGame((current) => ({
          ...current,
          stats: { ...current.stats, quietCasts: (current.stats.quietCasts || 0) + 1 },
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
          const isEligibleSpecimen = ['great', 'trophy'].includes(item.sizeTier)
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
              amazingLegendaryCaught: current.achievementProgress.amazingLegendaryCaught || (item.rarity === 'legendary' && item.sizeTier === 'trophy'),
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
      buyBoat: (id) => setGame((current) => purchaseBoat(current, id)),
      setBoatCosmetic: (boatId, cosmeticId) => setGame((current) => chooseBoatCosmetic(current, boatId, cosmeticId)),
      buyLure: (id) => setGame((current) => purchaseLure(current, id)),
      setFishingSetup: (locationId, type, id) => setGame((current) => chooseFishingSetup(current, locationId, type, id)),
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
      setTrophyRoomDisplay: (index, fishId) =>
        setGame((current) => {
          if (!current.commerce?.entitlementIds.includes('cabin:trophy-room') || index < 0 || index > 11) return current
          const nextDisplays = [...current.cabin.trophyRoomFeaturedFishIds]
          nextDisplays[index] = fishId || null
          return { ...current, cabin: { ...current.cabin, trophyRoomFeaturedFishIds: nextDisplays } }
        }),
      setCabinStyle: (styleId) => setGame((current) => chooseCabinStyle(current, styleId)),
      setCabinDecor: (cabinId, hookId, decorId, frameRole) => setGame((current) => chooseCabinDecor(current, cabinId, hookId, decorId, frameRole)),
      preserveSpecimen: (fishId) => setGame((current) => preserveCabinSpecimen(current, fishId)),
      purchaseStoreProduct: async (productId) => {
        setCommerce((current) => ({ ...current, pendingProductId: productId, message: null }))
        try {
          const result = await purchaseStoreProduct(productId)
          if (result.status === 'pending') {
            setCommerce((current) => ({ ...current, pendingProductId: null, message: 'Purchase pending approval. It will unlock after Google Play confirms payment.' }))
            return result
          }
          setGame((current) => ({ ...current, commerce: { entitlementIds: result.entitlementIds } }))
          setCommerce((current) => ({ ...current, ownedProductIds: result.ownedProductIds, pendingProductId: null, message: 'Purchase complete. Your cabin is permanently unlocked.' }))
          return result
        } catch (error) {
          setCommerce((current) => ({ ...current, pendingProductId: null, message: error?.message || 'The purchase did not complete. You were not charged.' }))
          return null
        }
      },
      restoreStorePurchases: async () => {
        setCommerce((current) => ({ ...current, status: 'restoring', message: null }))
        try {
          const result = await restoreStorePurchases()
          setGame((current) => ({ ...current, commerce: { entitlementIds: result.entitlementIds } }))
          setCommerce((current) => ({ ...current, status: 'ready', ownedProductIds: result.ownedProductIds, message: result.ownedProductIds.length ? 'Purchases restored.' : 'No previous purchases were found.' }))
          return result
        } catch (error) {
          setCommerce((current) => ({ ...current, status: 'error', message: error?.message || 'Purchases could not be restored. Try again later.' }))
          return null
        }
      },
      dismissNotice: () => setNotice(null),
      reset: () => {
        clearGame()
        knownAchievements.current.clear()
        setNotice(null)
        setGame((current) => ({ ...newGame(), commerce: current.commerce }))
      },
    }),
    [],
  )

  return (
    <GameContext.Provider value={{ game, actions, notice, storageAvailable, commerce }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
