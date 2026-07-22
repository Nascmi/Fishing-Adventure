import { useEffect } from 'react'
import Icon from '../components/Icon'
import { GAME_CONFIG } from '../data/config'
import { getLocation, locations } from '../data/locations'
import { useGame } from '../hooks/useGame'
import { DERBY_CAST_LIMIT, FIELD_NOTE_TEMPLATES } from '../game/activityRules'

const tripDuration = GAME_CONFIG.dayCycle.phaseMs * GAME_CONFIG.dayCycle.phases.length * GAME_CONFIG.dayCycle.tripDays

const remainingTime = (ms) => {
  const minutes = Math.max(0, Math.ceil(ms / 60000))
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m remaining`
}

export default function TripsPage({ currentLocationId, onChooseLocation, onGoFishing }) {
  const { game, actions } = useGame()
  const activeTrip = game.dayCycle.activeTrip
  const fieldNotes = game.activities.fieldNotes.entries
  const activeDerby = game.activities.derbies.active
  const derbyLocationId = currentLocationId === 'willow-pond' || activeTrip?.locationId === currentLocationId ? currentLocationId : 'willow-pond'
  const derbyLocation = getLocation(activeDerby?.locationId || derbyLocationId)
  const personalBest = game.activities.derbies.personalBests[derbyLocation.id]

  useEffect(() => actions.syncFieldNotes(), [actions])

  const abandonActiveDerby = () => {
    if (window.confirm('Set aside this Derby scorecard? There is no penalty, and you can begin another whenever you like.')) actions.abandonDerby()
  }

  const chooseHome = () => {
    if (activeTrip && !window.confirm(`Return to Backyard Pond and end the remaining ${getLocation(activeTrip.locationId).name} trip?`)) return
    if (activeTrip) actions.endTrip()
    onChooseLocation('willow-pond')
    onGoFishing()
  }

  const chooseDestination = (location) => {
    if (activeTrip?.locationId === location.id) {
      onChooseLocation(location.id)
      onGoFishing()
      return
    }
    if (activeTrip && !window.confirm(`End the current ${getLocation(activeTrip.locationId).name} trip and book ${location.name}?`)) return
    if (game.coins < location.tripCost) return
    actions.bookTrip(location.id)
    onChooseLocation(location.id)
    onGoFishing()
  }

  return <main className="content-page trips-page">
    <div className="page-heading"><div><span className="eyebrow">Choose your next water</span><h2>Fishing Trips</h2><p>Backyard Pond is always free. Destination charters include three full days of fishing.</p></div></div>
    <section className="angler-activities" aria-labelledby="angler-activities-title">
      <div className="activity-intro"><span className="eyebrow">Entirely optional</span><h3 id="angler-activities-title">Field Notes & Fishing Derbies</h3><p>Gentle reasons to revisit familiar water. There are no streaks, entry fees, rankings, or exclusive prizes.</p></div>
      <div className="activity-columns">
        <section className="field-notes-panel" aria-labelledby="field-notes-title">
          <div className="activity-heading"><div><span className="eyebrow">Three-day backlog</span><h4 id="field-notes-title">Field Notes</h4></div><span>{fieldNotes.filter((entry) => entry.completedAt).length}/{fieldNotes.length} complete</span></div>
          <div className="field-note-list">{fieldNotes.map((entry) => {
            const template = FIELD_NOTE_TEMPLATES.find((item) => item.id === entry.templateId)
            const progress = entry.templateId === 'variety-basket' ? entry.speciesIds.length : entry.progress
            return <article className={entry.completedAt ? 'complete' : ''} key={entry.id}><div><strong>{template?.title}</strong><span>{template?.description}</span></div><b>{entry.completedAt ? `Complete · +${template?.reward}` : `${Math.min(progress, template?.target || 0)}/${template?.target}`}</b></article>
          })}</div>
          <small>One note arrives per local day. Missed days never break a streak, and ordinary catches count automatically.</small>
        </section>
        <section className="derby-panel" aria-labelledby="derby-title">
          <span className="eyebrow">Personal scorecard</span><h4 id="derby-title">{derbyLocation.name} Derby</h4>
          {activeDerby ? <>
            <p>{activeDerby.locationId === currentLocationId ? 'Underway at this water.' : `Paused until you return to ${derbyLocation.name}.`} Catches earn 100 points, a new species adds 50, and larger specimens add a little more.</p>
            <div className="derby-score"><span><b>{activeDerby.score}</b> points</span><span><b>{activeDerby.castsUsed}</b> / {activeDerby.castLimit} casts</span><span><b>{activeDerby.catches.length}</b> landed</span></div>
            <button type="button" className="quiet-button" onClick={abandonActiveDerby}>Set scorecard aside</button>
          </> : <>
            <p>Take {DERBY_CAST_LIMIT} casts at {derbyLocation.name}. The scorecard pauses safely when you leave and awards no coins or gameplay power.</p>
            {personalBest && <p className="derby-best"><span>Personal best</span><b>{personalBest.score} points · {personalBest.catches} landed</b></p>}
            <button type="button" onClick={() => actions.startDerby(derbyLocation.id)}>Begin {DERBY_CAST_LIMIT}-cast Derby</button>
          </>}
        </section>
      </div>
    </section>
    <div className="trips-grid">
      {locations.map((location) => {
        const isHome = location.id === 'willow-pond'
        const isActive = activeTrip?.locationId === location.id
        const affordable = game.coins >= location.tripCost
        const isCurrent = currentLocationId === location.id
        return <article className={`trip-card ${isActive ? 'active-trip' : ''}`} key={location.id}>
          <div className="trip-art" style={{ backgroundImage: `linear-gradient(180deg,transparent 35%,#102e2daa),url("${location.image}")` }}><span>{isHome ? 'Home waters' : isActive ? 'Charter underway' : 'Three-day charter'}</span></div>
          <div className="trip-card-body">
            <h3>{location.name}</h3><p>{location.description}</p>
            <div className="trip-details"><span>{isHome ? 'Always available' : '12 fishing phases'}</span><b>{isHome ? 'Free' : `${location.tripCost.toLocaleString()} coins`}</b></div>
            {isActive && <div className="trip-progress"><i style={{ width: `${Math.max(0, activeTrip.remainingMs / tripDuration * 100)}%` }}/><span>{remainingTime(activeTrip.remainingMs)}</span></div>}
            <button type="button" disabled={!isHome && !isActive && !affordable} onClick={() => isHome ? chooseHome() : chooseDestination(location)}>
              <Icon name={isHome ? 'fishing' : 'trips'} size={18}/>{isHome ? (isCurrent ? 'Fish at home' : 'Return home') : isActive ? 'Continue fishing' : affordable ? 'Book fishing trip' : `Need ${(location.tripCost - game.coins).toLocaleString()} more`}
            </button>
          </div>
        </article>
      })}
    </div>
  </main>
}
