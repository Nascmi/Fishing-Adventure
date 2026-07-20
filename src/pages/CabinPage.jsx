import { useEffect, useState } from 'react'
import FishArtwork from '../components/FishArtwork'
import Icon from '../components/Icon'
import { GAME_CONFIG } from '../data/config'
import { achievements } from '../data/achievements'
import { fish, getFish } from '../data/fish'
import { getKeepsakeDesign } from '../data/keepsakes'
import { locations } from '../data/locations'
import { useGame } from '../hooks/useGame'
import { createCabinShareImage } from '../utils/cabinShareImage'
import cabinImage from '../assets/locations/cabin.webp'
import lodgeImage from '../assets/locations/angler-lodge.png'
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
  const legendaryCount = game.achievementProgress.legendaryLocations.length
  const lodgeUnlocked = legendaryCount >= 4
  const isLodge = cabin.styleId === 'angler-lodge' && lodgeUnlocked
  const featuredFish = getFish(cabin.featuredFishId)
  const featuredSpecimen = cabin.specimens[cabin.featuredFishId]?.mounted
  const souvenir = locations.find((location) => location.id === cabin.souvenirLocationId)
  const earnedKeepsakes = achievements.filter((achievement) => game.achievements[achievement.id])
  const earnedKeepsakeKey = earnedKeepsakes.map((achievement) => achievement.id).join('|')
  const [shareImage, setShareImage] = useState(null)
  const [shareStatus, setShareStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    setShareImage(null)
    setShareStatus('')
    const displayIds = isLodge ? cabin.lodgeFeaturedFishIds : [cabin.featuredFishId]
    const fishDisplays = displayIds.map((fishId) => fishId ? { fish: getFish(fishId), specimen: cabin.specimens[fishId]?.mounted } : null)
    createCabinShareImage({
      background: isLodge ? lodgeImage : cabinImage,
      cabinName: isLodge ? "Angler's Lodge" : 'Starter Cabin',
      fishDisplays,
      souvenir: !isLodge && souvenir ? souvenirArtwork[souvenir.id] : null,
      keepsakes: earnedKeepsakes.map((achievement) => getKeepsakeDesign(achievement.id)),
      isLodge,
    }).then((blob) => { if (!cancelled) setShareImage(blob) }).catch(() => { if (!cancelled) setShareStatus('Share image unavailable') })
    return () => { cancelled = true }
  }, [cabin.featuredFishId, cabin.lodgeFeaturedFishIds, cabin.specimens, earnedKeepsakeKey, isLodge, souvenir])

  const shareCabin = async () => {
    if (!shareImage) return
    const cabinName = isLodge ? "Angler's Lodge" : 'Starter Cabin'
    const filename = `fishing-adventure-${isLodge ? 'anglers-lodge' : 'starter-cabin'}.png`
    const file = typeof File === 'function' ? new File([shareImage], filename, { type: 'image/png' }) : null
    const shareData = file ? { files: [file], title: `My ${cabinName}`, text: `Take a look at my ${cabinName} in Fishing Adventure!` } : null
    try {
      if (shareData && navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        setShareStatus('Cabin shared')
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
      setShareStatus('Cabin image downloaded')
    } catch (error) {
      if (error.name !== 'AbortError') setShareStatus('Could not share this cabin')
    }
  }

  const displaySpecimen = (fishId) => {
    if (!isLodge) return actions.setCabinChoice('featuredFishId', fishId)
    const existingIndex = cabin.lodgeFeaturedFishIds.indexOf(fishId)
    const emptyIndex = cabin.lodgeFeaturedFishIds.indexOf(null)
    actions.setLodgeDisplay(existingIndex >= 0 ? existingIndex : emptyIndex >= 0 ? emptyIndex : 0, fishId)
  }

  return <main className="cabin-page">
    <div className="cabin-heading">
      <div><span className="eyebrow">Backyard Pond</span><h2>{isLodge ? "Angler's Lodge" : 'Your Cabin'}</h2><p>{isLodge ? 'A place earned through legendary waters.' : 'A humble place for the stories you bring home.'}</p></div>
      <div className="cabin-heading-actions"><button type="button" className="cabin-share-button" disabled={!shareImage} onClick={shareCabin}><Icon name="share" size={17}/>{shareImage ? 'Share cabin' : 'Preparing…'}</button><button type="button" className="secondary-button" onClick={onGoFishing}>Go fishing</button></div>
    </div>
    {shareStatus && <p className="cabin-share-status" role="status">{shareStatus}</p>}

    <section className="cabin-style-picker" aria-label="Cabin style">
      <button type="button" className={!isLodge ? 'selected' : ''} onClick={() => actions.setCabinStyle('starter')}><span>Included</span><strong>Starter Cabin</strong></button>
      <button type="button" className={isLodge ? 'selected' : ''} disabled={!lodgeUnlocked} onClick={() => actions.setCabinStyle('angler-lodge')}><span>{lodgeUnlocked ? 'Earned' : `${legendaryCount} of 4 legendary waters`}</span><strong>Angler's Lodge</strong></button>
    </section>

    {!isLodge ? <>
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
    </> : <>
      <section className="cabin-scene lodge-scene" style={{ '--cabin-art': `url("${lodgeImage}")` }} aria-label="The earned Angler's Lodge with three specimen mounts and a keepsake cabinet">
        {cabin.lodgeFeaturedFishIds.map((fishId, index) => {
          const mountedFish = getFish(fishId)
          const mounted = cabin.specimens[fishId]?.mounted
          return <div className={`lodge-mount lodge-mount-${index + 1} ${mounted?.sizeTier === 'amazing' ? 'size-amazing' : ''}`} key={index} aria-label={mountedFish ? `Preserved catch: ${mountedFish.name}` : `Empty lodge mount ${index + 1}`}>
            {mountedFish && <FishArtwork fishId={mountedFish.id} name={mountedFish.name} className="lodge-fish-art"/>}
          </div>
        })}
        <div className="lodge-keepsakes" aria-label={`${earnedKeepsakes.length} Angling Keepsakes displayed`}>{earnedKeepsakes.slice(0, 20).map((achievement) => { const design = getKeepsakeDesign(achievement.id); return <span className={`material-${design.material}`} title={achievement.name} key={achievement.id}><Icon name={design.icon} size={18}/></span> })}</div>
      </section>
      <section className="lodge-story"><article><span>Legendary waters</span><strong>{legendaryCount} explored</strong><small>The lodge remains yours permanently.</small></article><article><span>Preserved displays</span><strong>{cabin.lodgeFeaturedFishIds.filter(Boolean).length} of 3 filled</strong><small>Choose any preserved Trophy or Amazing specimens.</small></article><article><span>Keepsake cabinet</span><strong>{earnedKeepsakes.length} earned</strong><small>Your Angling Keepsakes appear automatically.</small></article></section>
    </>}

    <section className="cabin-customizer" aria-labelledby="cabin-customizer-title">
      <div><span className="eyebrow">Make it yours</span><h3 id="cabin-customizer-title">Cabin displays</h3><p>Everything here is yours to change whenever you like.</p></div>
      {!isLodge ? <>
        <label>Preserved display<select value={cabin.featuredFishId || ''} onChange={(event) => actions.setCabinChoice('featuredFishId', event.target.value || null)}><option value="">Empty mount</option>{preservedFish.map(({ fish: item, record }) => <option value={item.id} key={item.id}>{item.name} · {record.mounted.weight} lb</option>)}</select></label>
        <label>Travel souvenir<select value={cabin.souvenirLocationId} onChange={(event) => actions.setCabinChoice('souvenirLocationId', event.target.value)}>{visitedLocations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}</select></label>
      </> : cabin.lodgeFeaturedFishIds.map((fishId, index) => <label key={index}>Mount {index + 1}<select value={fishId || ''} onChange={(event) => actions.setLodgeDisplay(index, event.target.value || null)}><option value="">Empty mount</option>{preservedFish.map(({ fish: item, record }) => <option value={item.id} disabled={cabin.lodgeFeaturedFishIds.includes(item.id) && fishId !== item.id} key={item.id}>{item.name} · {record.mounted.weight} lb</option>)}</select></label>)}
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
          {record.mounted && !canUpgrade && <button type="button" className="secondary-button" onClick={() => displaySpecimen(item.id)}>Display</button>}
        </article>
      })}</div>
    </section>
  </main>
}
