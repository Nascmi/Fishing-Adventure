import { useEffect, useRef, useState } from 'react'
import { getRod } from '../data/rods'
import { useGame } from '../hooks/useGame'

export default function TopBar() {
  const { game } = useGame()
  const previousCoins = useRef(game.coins)
  const [coinChange, setCoinChange] = useState(null)

  useEffect(() => {
    const difference = game.coins - previousCoins.current
    previousCoins.current = game.coins
    if (!difference) return undefined
    setCoinChange(difference)
    const timer = setTimeout(() => setCoinChange(null), 1100)
    return () => clearTimeout(timer)
  }, [game.coins])

  return <header className="topbar"><div><span className="eyebrow">Today’s fishing spot</span><h1>Willow Pond</h1></div><div className={`wallet ${coinChange ? 'changing' : ''}`}><strong>{game.coins.toLocaleString()}</strong><span>coins</span>{coinChange && <i className={coinChange > 0 ? 'gain' : 'spent'}>{coinChange > 0 ? '+' : ''}{coinChange.toLocaleString()}</i>}</div><div className="rod-chip">{getRod(game.equippedRod).name}</div></header>
}
