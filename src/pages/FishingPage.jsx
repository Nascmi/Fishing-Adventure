import { useCallback, useEffect, useRef, useState } from 'react'
import FishArtwork from '../components/FishArtwork'
import RarityBadge from '../components/RarityBadge'
import ReelingGame from '../components/ReelingGame'
import { GAME_CONFIG } from '../data/config'
import { getLocation } from '../data/locations'
import { getRod } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { giveFeedback } from '../services/feedbackService'
import { randomDelay, selectFish } from '../utils/fishingEngine'
import { getWeightTier, makeCatch } from '../utils/valueCalculator'

const getCyclePosition = (elapsedMs) => {
  const { phaseMs, phases } = GAME_CONFIG.dayCycle
  const phaseIndex = Math.floor(elapsedMs / phaseMs) % phases.length
  return {
    phase: phases[phaseIndex],
    phaseIndex,
    day: Math.floor(elapsedMs / (phaseMs * phases.length)) + 1,
    phaseRemainingMs: phaseMs - (elapsedMs % phaseMs),
  }
}

const shortTime = (ms) => {
  const minutes = Math.max(0, Math.ceil(ms / 60000))
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`
}

const getStatusCopy = (location) => ({
  ready: `The ${location.waterLabel} is calm. Cast when you’re ready.`,
  casting: location.fishingStyle === 'fly' ? 'The fly line rolls softly over the current…' : location.fishingStyle === 'spinning' ? 'The lure sails toward open water…' : location.fishingStyle === 'cork' ? 'The popping cork lands beyond the oyster reef…' : `A smooth cast across the ${location.waterLabel}…`,
  waiting: location.fishingStyle === 'fly' ? 'Watch the drift. Something may rise.' : location.fishingStyle === 'spinning' ? 'Work the lure slowly. Watch the line.' : location.fishingStyle === 'cork' ? 'Pop the cork gently. Watch the tide.' : 'Watch the bobber. Something may be near.',
  biting: 'A bite! Reel in now!',
  reeling: 'Hold to reel. Release when tight.',
  escaped: 'The fish slipped away.',
  caught: `A fine catch from ${location.name}.`,
})

export default function FishingPage({ locationId, onLocationChange }) {
  const { game, actions } = useGame()
  const location = getLocation(locationId)
  const gear = game.gearByLocation[location.id]
  const equippedRod = getRod(gear.equippedRod, location.id)
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

  const activeTrip = game.dayCycle.activeTrip
  const hasLocationAccess = location.id === 'willow-pond' || activeTrip?.locationId === location.id
  const elapsedMs = location.id === 'willow-pond' ? game.dayCycle.homeElapsedMs : activeTrip?.elapsedMs || 0
  const cycle = getCyclePosition(elapsedMs)

  useEffect(() => {
    if (!hasLocationAccess) {
      onLocationChange('willow-pond')
      return undefined
    }
    let previous = performance.now()
    const interval = setInterval(() => {
      const now = performance.now()
      actions.tickDayCycle(location.id, now - previous)
      previous = now
    }, 5000)
    return () => clearInterval(interval)
  }, [actions, hasLocationAccess, location.id, onLocationChange])

  const finishAfterPause = useCallback(() => {
    later(() => changeState('ready'), GAME_CONFIG.resetDelayMs)
  }, [changeState, later])

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
    const selectedFish = selectFish(equippedRod.chances, location.fishIds, cycle.phase.id)
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
    <section className={`lake ${fishingState} location-${location.id} phase-${cycle.phase.id}`} style={{ '--location-art': `url("${location.image}")` }} aria-label={`${location.name}: ${location.description}`}>
      <div className={`day-cycle phase-${cycle.phase.id}`}>
        <div><span>{location.id === 'willow-pond' ? 'Home waters' : `Trip · Day ${cycle.day} of ${GAME_CONFIG.dayCycle.tripDays}`}</span><b>{cycle.phase.label} · {cycle.phase.time}</b></div>
        <small>{location.id === 'willow-pond' ? `${shortTime(cycle.phaseRemainingMs)} until ${GAME_CONFIG.dayCycle.phases[(cycle.phaseIndex + 1) % 4].label.toLowerCase()}` : `${shortTime(activeTrip?.remainingMs || 0)} left`}</small>
        <button type="button" disabled={fishingState !== 'ready'} onClick={() => actions.skipDayPhase(location.id)}>Skip ahead</button>
      </div>
      <div className="water"><div className={`strike-marker ${location.fishingStyle}`}><i/></div><div className="ripples"/></div>
    </section>

    <section className={`action-card ${fishingState === 'reeling' ? 'reeling-active' : ''}`}>
      <div className={`status ${fishingState}`} role="status" aria-live="assertive" aria-atomic="true"><span className="status-dot"/><div><b>{statusTitle}</b><p>{statusCopy[fishingState]}</p></div></div>
      {fishingState === 'reeling' && hookedCatch
        ? <ReelingGame catchItem={hookedCatch.catchItem} fish={hookedCatch.fish} rod={equippedRod} onCatch={landFish} onEscape={loseFish}/>
        : <>
          {recentCatch && <article className={`catch-card ${recentCatch.rarity} size-${recentCatch.sizeTier}`}><FishArtwork fishId={recentCatch.fishId} name={recentCatch.name} className="catch-fish-art"/><div><span>{catchLabel}</span><h3>{recentCatch.name}</h3><RarityBadge rarity={recentCatch.rarity}/></div><div className="catch-numbers"><b>{recentCatch.weight} lb</b><span>{recentCatch.value} coins</span></div></article>}
          <button className={`primary-button ${fishingState === 'biting' ? 'urgent' : ''}`} disabled={isLineOut || isResult} onClick={fishingState === 'biting' ? reel : cast}>{fishingState === 'biting' ? 'Hook Fish!' : isLineOut ? 'Line is out…' : 'Cast Line'}</button>
        </>}
    </section>
  </main>
}
