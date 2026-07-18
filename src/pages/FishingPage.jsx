import { useCallback, useEffect, useRef, useState } from 'react'
import RarityBadge from '../components/RarityBadge'
import Icon from '../components/Icon'
import { GAME_CONFIG } from '../data/config'
import { locations } from '../data/locations'
import { getRod } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { randomDelay, selectFish } from '../utils/fishingEngine'
import { makeCatch } from '../utils/valueCalculator'

const statusCopy = {
  ready: 'The water is calm. Cast when you’re ready.',
  casting: 'A smooth cast across the pond…',
  waiting: 'Watch the bobber. Something may be near.',
  biting: 'A bite! Reel in now!',
  escaped: 'The fish slipped away.',
  caught: 'A fine catch from Willow Pond.',
}

export default function FishingPage() {
  const { game, actions } = useGame()
  const [fishingState, setFishingState] = useState('ready')
  const [recentCatch, setRecentCatch] = useState(null)
  const timers = useRef(new Set())
  const stateRef = useRef(fishingState)

  const changeState = useCallback((nextState) => {
    stateRef.current = nextState
    setFishingState(nextState)
  }, [])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current.clear()
  }, [])

  const later = useCallback((callback, delay) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      callback()
    }, delay)
    timers.current.add(timer)
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const finishAfterPause = useCallback(() => {
    later(() => changeState('ready'), GAME_CONFIG.resetDelayMs)
  }, [changeState, later])

  const cast = () => {
    if (stateRef.current !== 'ready') return
    clearTimers()
    setRecentCatch(null)
    changeState('casting')
    actions.recordCast()

    later(() => {
      changeState('waiting')
      later(() => {
        changeState('biting')
        const reactionMs = GAME_CONFIG.reactionWindows[game.settings.reactionWindow]
        later(() => {
          if (stateRef.current !== 'biting') return
          actions.recordEscape()
          changeState('escaped')
          finishAfterPause()
        }, reactionMs)
      }, randomDelay(GAME_CONFIG.waitMinMs, GAME_CONFIG.waitMaxMs))
    }, GAME_CONFIG.castingMs)
  }

  const reel = () => {
    if (stateRef.current !== 'biting') return
    clearTimers()
    const selectedFish = selectFish(getRod(game.equippedRod).chances, locations[0].fishIds)
    const caught = makeCatch(selectedFish)
    actions.addCatch(caught)
    setRecentCatch(caught)
    changeState('caught')
    finishAfterPause()
  }

  const isLineOut = fishingState === 'casting' || fishingState === 'waiting'
  const isResult = fishingState === 'caught' || fishingState === 'escaped'
  const statusTitle = fishingState === 'biting' ? 'Fish on!' : fishingState === 'caught' ? 'Caught!' : fishingState === 'escaped' ? 'So close…' : 'At the water'

  return <main className="fishing-page"><section className={`lake ${fishingState}`} aria-label="Willow Pond at sunrise"><div className="sun"/><div className="hills far"/><div className="hills near"/><div className="shore"/><div className="water"><div className="bobber"><i/></div><div className="ripples"/></div><div className="scene-copy"><span className="eyebrow">Today’s fishing spot</span><h2>Willow Pond</h2><p>A gentle breeze moves through the reeds.</p></div></section><section className="action-card"><div className={`status ${fishingState}`} role="status" aria-live="assertive" aria-atomic="true"><span className="status-dot"/><div><b>{statusTitle}</b><p>{statusCopy[fishingState]}</p></div></div>{recentCatch && <article className="catch-card"><div className="fish-mark"><Icon name="fish" size={32}/></div><div><span>New catch</span><h3>{recentCatch.name}</h3><RarityBadge rarity={recentCatch.rarity}/></div><div className="catch-numbers"><b>{recentCatch.weight} lb</b><span>{recentCatch.value} coins</span></div></article>}<button className={`primary-button ${fishingState === 'biting' ? 'urgent' : ''}`} disabled={isLineOut || isResult} onClick={fishingState === 'biting' ? reel : cast}>{fishingState === 'biting' ? 'Reel In!' : isLineOut ? 'Line is out…' : 'Cast Line'}</button></section></main>
}
