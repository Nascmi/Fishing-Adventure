import FishArtwork from '../components/FishArtwork'
import { GAME_CONFIG } from '../data/config'
import { fish, getFish } from '../data/fish'
import { locations } from '../data/locations'
import { useGame } from '../hooks/useGame'
import cabinImage from '../assets/locations/cabin.webp'
import willowSouvenir from '../assets/cabin/willow.webp'
import pineSouvenir from '../assets/cabin/pine.webp'
import greatSouvenir from '../assets/cabin/great.webp'
import gulfSouvenir from '../assets/cabin/gulf.webp'
import openSouvenir from '../assets/cabin/open.webp'

const souvenirArtwork = {
  'willow-pond': willowSouvenir,
  'pine-river': pineSouvenir,
  'great-lake': greatSouvenir,
  'gulf-coast': gulfSouvenir,
  'open-gulf': openSouvenir,
}

export default function CabinPage({ onGoFishing }) {
  const { game, actions } = useGame()
  const cabin = game.cabin
  const specimens = fish.map((item) => ({ fish: item, record: cabin.specimens[item.id] })).filter(({ record }) => record)
  const preservedFish = specimens.filter(({ record }) => record.mounted)
  const visitedLocations = locations.filter((location) => game.achievementProgress.locationsFished.includes(location.id))
  const featuredFish = getFish(cabin.featuredFishId)
  const featuredSpecimen = cabin.specimens[cabin.featuredFishId]?.mounted
  const souvenir = locations.find((location) => location.id === cabin.souvenirLocationId)

  return <main className="cabin-page">
    <div className="cabin-heading">
      <div><span className="eyebrow">Backyard Pond</span><h2>Your Cabin</h2><p>A humble place for the stories you bring home.</p></div>
      <button type="button" className="secondary-button" onClick={onGoFishing}>Go fishing</button>
    </div>

    <section className="cabin-scene" style={{ '--cabin-art': `url("${cabinImage}")` }} aria-label="A humble, lived-in fishing cabin">
      <div className="cabin-featured" aria-label={featuredFish ? `Preserved catch: ${featuredFish.name}` : 'Empty preserved catch mount'}>
        {featuredFish ? <div className={`cabin-mount size-${featuredSpecimen.sizeTier}`}><FishArtwork fishId={featuredFish.id} name={featuredFish.name} className="cabin-fish-art"/></div> : <span>Ready for<br/>a preserved catch</span>}
      </div>
      {souvenir && <img className="cabin-souvenir" src={souvenirArtwork[souvenir.id]} alt={`${souvenir.name} souvenir`}/>}
    </section>

    <section className="cabin-story" aria-label="Cabin displays">
      <article><span>Above the fire</span><strong>{featuredFish?.name || 'No preserved catch yet'}</strong>{featuredFish && <small>{featuredSpecimen.weight} lb · {featuredSpecimen.sizeTier === 'amazing' ? 'Amazing' : 'Trophy'} specimen</small>}</article>
      <article><span>On the shelf</span><strong>{souvenir ? `${souvenir.name} souvenir` : 'An open place for a travel memory'}</strong><small>{souvenir ? `A reminder of time spent at ${souvenir.name}` : 'Backyard Pond feels like home'}</small></article>
    </section>

    <section className="cabin-customizer" aria-labelledby="cabin-customizer-title">
      <div><span className="eyebrow">Make it yours</span><h3 id="cabin-customizer-title">Cabin details</h3><p>Everything here is yours to change whenever you like.</p></div>
      <label>Preserved display<select value={cabin.featuredFishId || ''} onChange={(event) => actions.setCabinChoice('featuredFishId', event.target.value || null)}><option value="">Empty mount</option>{preservedFish.map(({ fish: item, record }) => <option value={item.id} key={item.id}>{item.name} · {record.mounted.weight} lb</option>)}</select></label>
      <label>Travel souvenir<select value={cabin.souvenirLocationId} onChange={(event) => actions.setCabinChoice('souvenirLocationId', event.target.value)}>{visitedLocations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}</select></label>
    </section>

    <section className="specimen-workshop" aria-labelledby="specimen-title">
      <div><span className="eyebrow">Trophy preservation</span><h3 id="specimen-title">Exceptional catches</h3><p>The best Trophy or Amazing catch of each species is remembered here, even after it is sold.</p></div>
      {!specimens.length && <p className="specimen-empty">Your first Trophy or Amazing specimen will appear here.</p>}
      <div className="specimen-grid">{specimens.map(({ fish: item, record }) => {
        const canUpgrade = record.mounted && record.weight > record.mounted.weight
        const location = locations.find((entry) => entry.id === record.locationId)
        return <article className={`specimen-card size-${record.sizeTier}`} key={item.id}>
          <FishArtwork fishId={item.id} name={item.name} className="specimen-art"/>
          <div><span>{record.sizeTier === 'amazing' ? 'Amazing specimen' : 'Trophy specimen'}</span><h4>{item.name}</h4><p>{record.weight} lb · {location?.name || 'Unknown water'}</p>{record.mounted && <small>Preserved at {record.mounted.weight} lb</small>}</div>
          {!record.mounted && <button type="button" disabled={game.coins < GAME_CONFIG.trophyPreservationCost} onClick={() => actions.preserveSpecimen(item.id)}>Preserve · {GAME_CONFIG.trophyPreservationCost} coins</button>}
          {canUpgrade && <button type="button" onClick={() => actions.preserveSpecimen(item.id)}>Upgrade mount · Free</button>}
          {record.mounted && !canUpgrade && <button type="button" className="secondary-button" onClick={() => actions.setCabinChoice('featuredFishId', item.id)}>Display</button>}
        </article>
      })}</div>
    </section>
  </main>
}
