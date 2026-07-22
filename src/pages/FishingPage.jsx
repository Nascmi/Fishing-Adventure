import { useCallback, useEffect, useRef, useState } from 'react'
import FishArtwork from '../components/FishArtwork'
import Icon from '../components/Icon'
import RarityBadge from '../components/RarityBadge'
import ReelingGame from '../components/ReelingGame'
import { GAME_CONFIG } from '../data/config'
import { getLocation } from '../data/locations'
import { getFish } from '../data/fish'
import { getRod } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { giveFeedback } from '../services/feedbackService'
import { randomDelay, selectFish } from '../utils/fishingEngine'
import { getWeightTier, makeCatch } from '../utils/valueCalculator'
import { createCatchShareImage } from '../utils/catchShareImage'
import { getAreasForLocation, getBoatForLocation, getFishingArea, getLureFamily, getLuresForLocation, getPhaseFourFishWeights } from '../data/waterSetup'
import { getEquippedBoatImage } from '../data/boatCosmetics'
import { isQuietCast } from '../game/biteRules'

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
  casting: location.fishingStyle === 'fly' ? 'The fly line rolls softly over the current…' : location.fishingStyle === 'spinning' ? 'The lure sails toward open water…' : location.fishingStyle === 'cork' ? 'The popping cork lands beyond the oyster reef…' : location.fishingStyle === 'jig' ? 'The heavy jig drops into blue water…' : `A smooth cast across the ${location.waterLabel}…`,
  waiting: location.fishingStyle === 'fly' ? 'Watch the drift. Something may rise.' : location.fishingStyle === 'spinning' ? 'Work the lure slowly. Watch the line.' : location.fishingStyle === 'cork' ? 'Pop the cork gently. Watch the tide.' : location.fishingStyle === 'jig' ? 'Work the jig through the offshore current. Watch the line.' : 'Watch the bobber. Something may be near.',
  biting: 'A bite! Reel in now!',
  reeling: 'Hold to reel. Release when tight.',
  escaped: 'The fish slipped away.',
  quiet: 'Nothing this time. Try another cast.',
  caught: `A fine catch from ${location.name}.`,
})

export default function FishingPage({ locationId, onLocationChange, onOpenCabin }) {
  const { game, actions } = useGame()
  const location = getLocation(locationId)
  const gear = game.gearByLocation[location.id]
  const equippedRod = getRod(gear.equippedRod, location.id)
  const [fishingState, setFishingState] = useState('ready')
  const [recentCatch, setRecentCatch] = useState(null)
  const [hookedCatch, setHookedCatch] = useState(null)
  const [shareImage, setShareImage] = useState(null)
  const [shareStatus, setShareStatus] = useState('')
  const [setupExpanded, setSetupExpanded] = useState(false)
  const [pendingRelocation, setPendingRelocation] = useState(null)
  const [relocationStatus, setRelocationStatus] = useState('')
  const [departingScene, setDepartingScene] = useState(null)
  const timers = useRef(new Set())
  const stateRef = useRef(fishingState)
  const previousCastWasQuiet = useRef(false)
  const relocationDialogRef = useRef(null)
  const relocationTriggerRef = useRef(null)

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
  useEffect(() => setPendingRelocation(null), [location.id])

  const activeTrip = game.dayCycle.activeTrip
  const activeDerby = game.activities.derbies.active?.locationId === location.id ? game.activities.derbies.active : null
  const hasLocationAccess = location.id === 'willow-pond' || activeTrip?.locationId === location.id
  const elapsedMs = location.id === 'willow-pond' ? game.dayCycle.homeElapsedMs : activeTrip?.elapsedMs || 0
  const cycle = getCyclePosition(elapsedMs)
  const fishingSetup = game.fishingSetupByLocation?.[location.id]
  const selectedArea = getFishingArea(fishingSetup?.areaId)
  const selectedLure = getLureFamily(fishingSetup?.lureId)
  const availableLures = getLuresForLocation(location.id).filter((lure) => lure.included || game.tackle.ownedLureIds.includes(lure.id))
  const availableAreas = getAreasForLocation(location.id)
  const locationBoat = getBoatForLocation(location.id)
  const ownsLocationBoat = locationBoat && game.watercraft?.ownedBoatIds.includes(locationBoat.id)
  const sceneImage = selectedArea?.image || location.image
  const activeSceneRef = useRef(sceneImage)

  useEffect(() => {
    for (const area of availableAreas) {
      if (!area.image || area.image === sceneImage) continue
      const image = new Image()
      image.decoding = 'async'
      image.src = area.image
      image.decode?.().catch(() => {})
    }
  }, [location.id, sceneImage])

  useEffect(() => {
    if (activeSceneRef.current === sceneImage) return undefined
    setDepartingScene(activeSceneRef.current)
    activeSceneRef.current = sceneImage
    const timer = setTimeout(() => setDepartingScene(null), 480)
    return () => clearTimeout(timer)
  }, [sceneImage])

  useEffect(() => {
    if (!relocationStatus) return undefined
    const timer = setTimeout(() => setRelocationStatus(''), 3500)
    return () => clearTimeout(timer)
  }, [relocationStatus])

  useEffect(() => {
    if (!pendingRelocation) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = relocationDialogRef.current
    const focusable = [...(dialog?.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])') || [])]
    focusable[0]?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setPendingRelocation(null)
        return
      }
      if (event.key !== 'Tab' || focusable.length < 2) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      relocationTriggerRef.current?.focus()
    }
  }, [pendingRelocation])

  useEffect(() => {
    let cancelled = false
    setShareImage(null)
    setShareStatus('')
    if (recentCatch?.sizeTier !== 'trophy') return () => { cancelled = true }
    createCatchShareImage(recentCatch, getFish(recentCatch.fishId), location, recentCatch.phaseLabel)
      .then((blob) => { if (!cancelled) setShareImage(blob) })
      .catch(() => { if (!cancelled) setShareStatus('Share image unavailable') })
    return () => { cancelled = true }
  }, [location, recentCatch])

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
    actions.recordCast(location.id)

    later(() => {
      changeState('waiting')
      later(() => {
        const quiet = isQuietCast(equippedRod, previousCastWasQuiet.current)
        previousCastWasQuiet.current = quiet
        if (quiet) {
          actions.recordQuietCast(location.id)
          changeState('quiet')
          finishAfterPause()
          return
        }
        changeState('biting')
        giveFeedback('bite', game.settings)
        const reactionMs = GAME_CONFIG.reactionWindows[game.settings.reactionWindow]
        later(() => {
          if (stateRef.current !== 'biting') return
          actions.recordEscape(location.id)
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
    const setupWeights = getPhaseFourFishWeights(selectedArea?.id, selectedLure?.id)
    const selectedFish = selectFish(equippedRod.chances, location.fishIds, cycle.phase.id, Math.random, setupWeights)
    setHookedCatch({ fish: selectedFish, catchItem: makeCatch(selectedFish) })
    changeState('reeling')
  }

  const landFish = useCallback(() => {
    if (!hookedCatch || stateRef.current !== 'reeling') return
    const previousBest = game.collection[hookedCatch.fish.id]?.largestWeight || 0
    actions.addCatch(hookedCatch.catchItem, location.id, cycle.phase.id)
    giveFeedback('catch', game.settings)
    setRecentCatch({
      ...hookedCatch.catchItem,
      isPersonalBest: hookedCatch.catchItem.weight > previousBest,
      phaseLabel: cycle.phase.label,
    })
    changeState('caught')
    finishAfterPause()
  }, [actions, changeState, cycle.phase.id, finishAfterPause, game.collection, game.settings, hookedCatch, location.id])

  const loseFish = useCallback(() => {
    if (stateRef.current !== 'reeling') return
    actions.recordEscape(location.id)
    giveFeedback('escape', game.settings)
    changeState('escaped')
    finishAfterPause()
  }, [actions, changeState, finishAfterPause, game.settings])

  const shareCatch = async () => {
    if (!shareImage || !recentCatch) return
    const safeName = recentCatch.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const filename = `fishing-adventure-${safeName}.png`
    const file = typeof File === 'function' ? new File([shareImage], filename, { type: 'image/png' }) : null
    const shareData = file ? { files: [file], title: `Trophy ${recentCatch.name} catch`, text: `I caught a trophy ${recentCatch.weight} lb ${recentCatch.name} at ${location.name} in Fishing Adventure!` } : null
    try {
      if (shareData && navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        setShareStatus('Catch shared')
        return
      }
      const url = URL.createObjectURL(shareImage)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setShareStatus('Catch image downloaded')
    } catch (error) {
      if (error.name !== 'AbortError') setShareStatus('Could not share this catch')
    }
  }

  const isLineOut = fishingState === 'casting' || fishingState === 'waiting'
  const isResult = fishingState === 'caught' || fishingState === 'escaped' || fishingState === 'quiet'
  const statusTitle = fishingState === 'biting' ? 'Fish on!' : fishingState === 'reeling' ? 'On the line!' : fishingState === 'caught' ? 'Caught!' : fishingState === 'escaped' ? 'So close…' : fishingState === 'quiet' ? 'Quiet water' : 'At the water'
  const statusCopy = getStatusCopy(location)
  const catchLabel = recentCatch
    ? `${getWeightTier(recentCatch.sizeTier).label}${recentCatch.isPersonalBest ? ' · Personal best' : ''}`
    : ''
  const isRaining = game.weather.rainRemainingMs > 0
  const rainEnding = isRaining && game.weather.rainRemainingMs <= 15000
  const chooseArea = (area) => {
    if (area.id === selectedArea?.id) return
    if (area.relocationCost) {
      relocationTriggerRef.current = document.activeElement
      setPendingRelocation(area)
      return
    }
    actions.setFishingSetup(location.id, 'area', area.id)
  }

  const acceptRelocation = () => {
    if (!pendingRelocation || game.coins < pendingRelocation.relocationCost) return
    const destination = pendingRelocation.name
    const cost = pendingRelocation.relocationCost
    actions.setFishingSetup(location.id, 'area', pendingRelocation.id)
    setPendingRelocation(null)
    setRelocationStatus(`The Captain moved the charter to ${destination} and charged ${cost.toLocaleString()} coins for fuel.`)
  }

  return <main className="fishing-page">
    <section className={`lake ${fishingState} location-${location.id}${selectedArea ? ` area-${selectedArea.id}` : ''} phase-${cycle.phase.id}${isRaining ? ` weather-rain${rainEnding ? ' rain-ending' : ''}` : ''}`} style={{ '--location-art': `url("${sceneImage}")` }} aria-label={`${location.name}${selectedArea ? `, ${selectedArea.name}` : ''}: ${selectedArea?.description || location.description}${isRaining ? ' A gentle rain is passing through.' : ''}`}>
      {selectedArea?.id === 'great-lake-weed-edge' && <div className="mirrored-area-background" style={{ backgroundImage: `url("${sceneImage}")` }} aria-hidden="true"/>}
      {departingScene && <div className="scene-transition" key={departingScene} style={{ backgroundImage: `linear-gradient(180deg,#1737360d,#17373612),url("${departingScene}")` }} aria-hidden="true"/>}
      {isRaining && <div className="weather-rainfall" aria-hidden="true"><i/><i/></div>}
      <div className={`day-cycle phase-${cycle.phase.id}`}>
        <div><span>{location.id === 'willow-pond' ? 'Home waters' : `Trip · Day ${cycle.day} of ${GAME_CONFIG.dayCycle.tripDays}`}</span><b>{cycle.phase.label} · {cycle.phase.time}</b></div>
        <small>{location.id === 'willow-pond' ? `${shortTime(cycle.phaseRemainingMs)} until ${GAME_CONFIG.dayCycle.phases[(cycle.phaseIndex + 1) % 4].label.toLowerCase()}` : `${shortTime(activeTrip?.remainingMs || 0)} left`}</small>
        <button type="button" disabled={fishingState !== 'ready'} onClick={() => actions.skipDayPhase(location.id)}>Skip ahead</button>
      </div>
      <div className="water">
        {selectedArea?.boatRequired && ownsLocationBoat && <img className={`scene-boat boat-${location.id} position-${selectedArea.boatPosition}`} src={getEquippedBoatImage(game, locationBoat)} alt={`${locationBoat.name} on the ${selectedArea.name}`} decoding="async"/>}
        <div className={`strike-marker ${location.fishingStyle} lure-${selectedLure?.id || 'default'}`} aria-hidden="true"><i/></div><div className="ripples"/>
      </div>
    </section>

    <section className={`action-card ${fishingState === 'reeling' ? 'reeling-active' : ''}`}>
      {fishingState === 'ready' && <section className={`water-setup${setupExpanded ? ' expanded' : ''}`} aria-label={`${location.name} fishing setup`}>
        <div className="water-setup-heading"><div><span className="eyebrow">On the water</span><b>{selectedArea ? `${selectedArea.name} · ` : ''}{selectedLure?.name}</b></div><div className="water-setup-actions"><button type="button" className="return-cabin-button" onClick={onOpenCabin}>View cabin</button><button type="button" className="setup-toggle" aria-expanded={setupExpanded} onClick={() => setSetupExpanded((expanded) => !expanded)}>{setupExpanded ? 'Done' : 'Change'}</button>{locationBoat && !ownsLocationBoat && <button type="button" disabled={game.coins < locationBoat.price} onClick={() => actions.buyBoat(locationBoat.id)}>Buy {locationBoat.name.toLowerCase()} · {locationBoat.price.toLocaleString()}</button>}</div></div>
        {activeDerby && <p className="derby-water-status" role="status">Personal Derby · {activeDerby.castsUsed}/{activeDerby.castLimit} casts · {activeDerby.score} points</p>}
        {availableAreas.length > 0 && <fieldset><legend>{location.id === 'open-gulf' ? 'Charter position' : 'Fishing area'}</legend><div className="setup-options">{availableAreas.map((area) => { const selected = selectedArea?.id === area.id; const locked = area.boatRequired && !ownsLocationBoat; const unaffordable = !selected && area.relocationCost > game.coins; const detail = locked ? `${locationBoat?.name || 'Boat'} required` : !selected && area.relocationCost ? `${area.description} · Move ${area.relocationCost.toLocaleString()}` : area.description; return <button type="button" key={area.id} className={selected ? 'selected' : ''} aria-pressed={selected} disabled={locked || unaffordable} onClick={() => chooseArea(area)}><b>{area.name}</b><span>{unaffordable ? `${area.description} · Need ${(area.relocationCost - game.coins).toLocaleString()} more` : detail}</span></button> })}</div></fieldset>}
        <fieldset><legend>Reusable lure</legend><div className="setup-options">{availableLures.map((lure) => { const selected = selectedLure?.id === lure.id; return <button type="button" key={lure.id} className={selected ? 'selected' : ''} aria-pressed={selected} onClick={() => actions.setFishingSetup(location.id, 'lure', lure.id)}><b>{lure.name}</b><span>{lure.targetFishIds?.length ? `${Math.round((lure.affinity - 1) * 100)}% target affinity` : lure.description}</span></button> })}</div></fieldset>
      </section>}
      {relocationStatus && <p className="relocation-status" role="status">{relocationStatus}</p>}
      <div className={`status ${fishingState}`} role="status" aria-live="assertive" aria-atomic="true"><span className="status-dot"/><div><b>{statusTitle}</b><p>{statusCopy[fishingState]}</p></div></div>
      {fishingState === 'reeling' && hookedCatch
        ? <ReelingGame catchItem={hookedCatch.catchItem} fish={hookedCatch.fish} rod={equippedRod} onCatch={landFish} onEscape={loseFish}/>
        : <>
          {recentCatch && <article className={`catch-card ${recentCatch.rarity} size-${recentCatch.sizeTier}`}><FishArtwork fishId={recentCatch.fishId} name={recentCatch.name} className="catch-fish-art"/><div><span>{catchLabel}</span><h3>{recentCatch.name}</h3><RarityBadge rarity={recentCatch.rarity}/></div><div className="catch-numbers"><b>{recentCatch.weight} lb</b><span>{recentCatch.value} coins</span></div></article>}
          {recentCatch?.sizeTier === 'trophy' && <div className="amazing-share"><button type="button" disabled={!shareImage} onClick={shareCatch}><Icon name="share" size={18}/>{shareImage ? 'Share trophy catch' : 'Preparing catch image…'}</button>{shareStatus && <span role="status">{shareStatus}</span>}</div>}
          <button className={`primary-button ${fishingState === 'biting' ? 'urgent' : ''}`} disabled={isLineOut || isResult} onClick={fishingState === 'biting' ? reel : cast}>{fishingState === 'biting' ? 'Hook Fish!' : isLineOut ? 'Line is out…' : 'Cast Line'}</button>
        </>}
    </section>
    {pendingRelocation && <div className="relocation-confirmation-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingRelocation(null) }}><section ref={relocationDialogRef} className="relocation-confirmation" role="dialog" aria-modal="true" aria-labelledby="relocation-title" aria-describedby="relocation-description"><span className="eyebrow">Charter relocation</span><h2 id="relocation-title">Move to {pendingRelocation.name}?</h2><p id="relocation-description">The Captain can relocate the charter, but he charges <b>{pendingRelocation.relocationCost.toLocaleString()} coins</b> for fuel. Do you accept?</p><div><button type="button" className="secondary-button" onClick={() => setPendingRelocation(null)}>Stay here</button><button type="button" className="primary-button" onClick={acceptRelocation}>Accept and relocate</button></div></section></div>}
  </main>
}
