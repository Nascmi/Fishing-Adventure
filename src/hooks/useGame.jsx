import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearGame, loadGame, newGame, rarityRank, saveGame } from '../services/saveService'
import { getRod } from '../data/rods'

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
      buyRod: (id) =>
        setGame((current) => {
          const rod = getRod(id)
          if (current.ownedRods.includes(id) || current.coins < rod.price) return current
          return {
            ...current,
            coins: current.coins - rod.price,
            ownedRods: [...current.ownedRods, id],
          }
        }),
      equipRod: (id) =>
        setGame((current) =>
          current.ownedRods.includes(id) ? { ...current, equippedRod: id } : current,
        ),
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
