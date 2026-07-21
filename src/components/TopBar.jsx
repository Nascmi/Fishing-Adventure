import { useEffect, useRef, useState } from 'react'
import { getRod } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { advanceWalletGesture, armWalletGesture, WALLET_HOLD_MS } from '../utils/walletGesture'

export default function TopBar({ location }) {
  const { game, actions } = useGame()
  const previousCoins = useRef(game.coins)
  const holdTimer = useRef(null)
  const gesture = useRef(null)
  const ignoreReleaseTap = useRef(false)
  const [coinChange, setCoinChange] = useState(null)

  useEffect(() => {
    const difference = game.coins - previousCoins.current
    previousCoins.current = game.coins
    if (!difference) return undefined
    setCoinChange(difference)
    const timer = setTimeout(() => setCoinChange(null), 1100)
    return () => clearTimeout(timer)
  }, [game.coins])

  useEffect(() => () => clearTimeout(holdTimer.current), [])

  const equippedRod = game.gearByLocation[location.id]?.equippedRod
  const beginWalletHold = () => {
    clearTimeout(holdTimer.current)
    ignoreReleaseTap.current = false
    holdTimer.current = setTimeout(() => {
      gesture.current = armWalletGesture(Date.now())
      ignoreReleaseTap.current = true
    }, WALLET_HOLD_MS)
  }
  const endWalletHold = () => clearTimeout(holdTimer.current)
  const tapWallet = () => {
    if (ignoreReleaseTap.current) {
      ignoreReleaseTap.current = false
      return
    }
    const result = advanceWalletGesture(gesture.current, Date.now())
    gesture.current = result.state
    if (result.completed) actions.completeWalletGesture()
  }

  return <header className="topbar"><div><span className="eyebrow">Today’s fishing spot</span><h1>{location.name}</h1></div><div className={`wallet ${coinChange ? 'changing' : ''}`} onPointerDown={beginWalletHold} onPointerUp={endWalletHold} onPointerCancel={endWalletHold} onClick={tapWallet} onContextMenu={(event) => event.preventDefault()}><strong>{game.coins.toLocaleString()}</strong><span>coins</span>{coinChange && <i className={coinChange > 0 ? 'gain' : 'spent'}>{coinChange > 0 ? '+' : ''}{coinChange.toLocaleString()}</i>}</div><div className="rod-chip">{getRod(equippedRod, location.id).name}</div></header>
}
