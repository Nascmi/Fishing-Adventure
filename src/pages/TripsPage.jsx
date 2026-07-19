import Icon from '../components/Icon'
import { GAME_CONFIG } from '../data/config'
import { getLocation, locations } from '../data/locations'
import { useGame } from '../hooks/useGame'

const tripDuration = GAME_CONFIG.dayCycle.phaseMs * GAME_CONFIG.dayCycle.phases.length * GAME_CONFIG.dayCycle.tripDays

const remainingTime = (ms) => {
  const minutes = Math.max(0, Math.ceil(ms / 60000))
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m remaining`
}

export default function TripsPage({ currentLocationId, onChooseLocation, onGoFishing }) {
  const { game, actions } = useGame()
  const activeTrip = game.dayCycle.activeTrip

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
