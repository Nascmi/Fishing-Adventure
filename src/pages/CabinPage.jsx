import FishArtwork from '../components/FishArtwork'
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
  const caughtFish = fish.filter((item) => game.collection[item.id]?.count)
  const visitedLocations = locations.filter((location) => game.achievementProgress.locationsFished.includes(location.id))
  const featuredFish = getFish(cabin.featuredFishId)
  const souvenir = locations.find((location) => location.id === cabin.souvenirLocationId)

  return <main className="cabin-page">
    <div className="cabin-heading">
      <div><span className="eyebrow">Backyard Pond</span><h2>Your Cabin</h2><p>A humble place for the stories you bring home.</p></div>
      <button type="button" className="secondary-button" onClick={onGoFishing}>Go fishing</button>
    </div>

    <section className="cabin-scene" style={{ '--cabin-art': `url("${cabinImage}")` }} aria-label="A humble, lived-in fishing cabin">
      <div className="cabin-featured" aria-label={featuredFish ? `Featured catch: ${featuredFish.name}` : 'Empty featured catch frame'}>
        {featuredFish ? <FishArtwork fishId={featuredFish.id} name={featuredFish.name} className="cabin-fish-art"/> : <span>Ready for<br/>a favorite catch</span>}
      </div>
      {souvenir && <img className="cabin-souvenir" src={souvenirArtwork[souvenir.id]} alt={`${souvenir.name} souvenir`}/>}
    </section>

    <section className="cabin-story" aria-label="Cabin displays">
      <article><span>Above the fire</span><strong>{featuredFish?.name || 'No featured catch yet'}</strong>{featuredFish && <small>{game.collection[featuredFish.id].largestWeight} lb personal best</small>}</article>
      <article><span>On the shelf</span><strong>{souvenir ? `${souvenir.name} souvenir` : 'An open place for a travel memory'}</strong><small>{souvenir ? `A reminder of time spent at ${souvenir.name}` : 'Backyard Pond feels like home'}</small></article>
    </section>

    <section className="cabin-customizer" aria-labelledby="cabin-customizer-title">
      <div><span className="eyebrow">Make it yours</span><h3 id="cabin-customizer-title">Cabin details</h3><p>Everything here is yours to change whenever you like.</p></div>
      <label>Featured catch<select value={cabin.featuredFishId || ''} onChange={(event) => actions.setCabinChoice('featuredFishId', event.target.value || null)}><option value="">Empty frame</option>{caughtFish.map((item) => <option value={item.id} key={item.id}>{item.name} · {game.collection[item.id].largestWeight} lb</option>)}</select></label>
      <label>Travel souvenir<select value={cabin.souvenirLocationId} onChange={(event) => actions.setCabinChoice('souvenirLocationId', event.target.value)}>{visitedLocations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}</select></label>
    </section>
  </main>
}
