import { useCallback, useEffect, useRef, useState } from 'react'
import FishArtwork from '../components/FishArtwork'
import RarityBadge from '../components/RarityBadge'
import ReelingGame from '../components/ReelingGame'
import { GAME_CONFIG } from '../data/config'
import { getLocation, locations } from '../data/locations'
import { getRod } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { giveFeedback } from '../services/feedbackService'
import { randomDelay, selectFish } from '../utils/fishingEngine'
import { getWeightTier, makeCatch } from '../utils/valueCalculator'

const getStatusCopy = (location) => ({
  ready: `The ${location.waterLabel} is calm. Cast when you’re ready.`,
  casting: `A smooth cast across the ${location.waterLabel}…`,
  waiting: 'Watch the bobber. Something may be near.',
  biting: 'A bite! Reel in now!',
  reeling: 'Hold to reel. Release when tight.',
  escaped: 'The fish slipped away.',
  caught: `A fine catch from ${location.name}.`,
})

export default function FishingPage({ locationId, onLocationChange }) {
  const { game, actions } = useGame()
  const location = getLocation(locationId)
  const [fishingState, setFishingState] = useState('ready')
  const [recentCatch, setRecentCatch] = useState(null)
  const [hookedCatch, setHookedCatch] = useState(null)
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

  const chooseLocation = (nextLocationId) => {
    if (stateRef.current !== 'ready' || nextLocationId === location.id) return
    clearTimers()
    setRecentCatch(null)
    setHookedCatch(null)
    onLocationChange(nextLocationId)
  }

  const cast = () => {
    if (stateRef.current !== 'ready') return
    clearTimers()
    setRecentCatch(null)
    setHookedCatch(null)
    changeState('casting')
    giveFeedback('cast', game.settings)
    actions.recordCast()

    later(() => {
      changeState('waiting')
      later(() => {
        changeState('biting')
        giveFeedback('bite', game.settings)
        const reactionMs = GAME_CONFIG.reactionWindows[game.settings.reactionWindow]
        later(() => {
          if (stateRef.current !== 'biting') return
          actions.recordEscape()
          giveFeedback('escape', game.settings)
          changeState('escaped')
          finishAfterPause()
        }, reactionMs)
      }, randomDelay(GAME_CONFIG.waitMinMs, GAME_CONFIG.waitMaxMs))
    }, GAME_CONFIG.castingMs)
  }

  const reel = () => {
    if (stateRef.current !== 'biting') return
    clearTimers()
    giveFeedback('hook', game.settings)
    const selectedFish = selectFish(getRod(game.equippedRod).chances, location.fishIds)
    setHookedCatch({ fish: selectedFish, catchItem: makeCatch(selectedFish) })
    changeState('reeling')
  }

  const landFish = useCallback(() => {
    if (!hookedCatch || stateRef.current !== 'reeling') return
    const previousBest = game.collection[hookedCatch.fish.id]?.largestWeight || 0
    actions.addCatch(hookedCatch.catchItem)
    giveFeedback('catch', game.settings)
    setRecentCatch({
      ...hookedCatch.catchItem,
      isPersonalBest: hookedCatch.catchItem.weight > previousBest,
    })
    changeState('caught')
    finishAfterPause()
  }, [actions, changeState, finishAfterPause, game.collection, game.settings, hookedCatch])

  const loseFish = useCallback(() => {
    if (stateRef.current !== 'reeling') return
    actions.recordEscape()
    giveFeedback('escape', game.settings)
    changeState('escaped')
    finishAfterPause()
  }, [actions, changeState, finishAfterPause, game.settings])

  const isLineOut = fishingState === 'casting' || fishingState === 'waiting'
  const isResult = fishingState === 'caught' || fishingState === 'escaped'
  const statusTitle = fishingState === 'biting' ? 'Fish on!' : fishingState === 'reeling' ? 'On the line!' : fishingState === 'caught' ? 'Caught!' : fishingState === 'escaped' ? 'So close…' : 'At the water'
  const statusCopy = getStatusCopy(location)
  const catchLabel = recentCatch
    ? `${getWeightTier(recentCatch.sizeTier).label}${recentCatch.isPersonalBest ? ' · Personal best' : ''}`
    : ''

  return <main className="fishing-page">
    <section className={`lake ${fishingState} location-${location.id}`} style={{ '--location-art': `url("${location.image}")` }} aria-label={`${location.name}: ${location.description}`}>
      <div className="location-switcher" aria-label="Fishing location">
        {locations.map((item) => <button key={item.id} className={item.id === location.id ? 'active' : ''} disabled={fishingState !== 'ready'} onClick={() => chooseLocation(item.id)} aria-pressed={item.id === location.id}>{item.name}</button>)}
      </div>
      <div className="water"><div className="bobber"><i/></div><div className="ripples"/></div>
    </section>

    <section className={`action-card ${fishingState === 'reeling' ? 'reeling-active' : ''}`}>
      <div className={`status ${fishingState}`} role="status" aria-live="assertive" aria-atomic="true"><span className="status-dot"/><div><b>{statusTitle}</b><p>{statusCopy[fishingState]}</p></div></div>
      {fishingState === 'reeling' && hookedCatch
        ? <ReelingGame catchItem={hookedCatch.catchItem} fish={hookedCatch.fish} rod={getRod(game.equippedRod)} onCatch={landFish} onEscape={loseFish}/>
        : <>
          {recentCatch && <article className={`catch-card ${recentCatch.rarity} size-${recentCatch.sizeTier}`}><FishArtwork fishId={recentCatch.fishId} name={recentCatch.name} className="catch-fish-art"/><div><span>{catchLabel}</span><h3>{recentCatch.name}</h3><RarityBadge rarity={recentCatch.rarity}/></div><div className="catch-numbers"><b>{recentCatch.weight} lb</b><span>{recentCatch.value} coins</span></div></article>}
          <button className={`primary-button ${fishingState === 'biting' ? 'urgent' : ''}`} disabled={isLineOut || isResult} onClick={fishingState === 'biting' ? reel : cast}>{fishingState === 'biting' ? 'Hook Fish!' : isLineOut ? 'Line is out…' : 'Cast Line'}</button>
        </>}
    </section>
  </main>
}
