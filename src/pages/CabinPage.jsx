import { useEffect, useState } from 'react'
import FishArtwork from '../components/FishArtwork'
import Icon from '../components/Icon'
import { GAME_CONFIG } from '../data/config'
import { achievements } from '../data/achievements'
import { fish, getFish } from '../data/fish'
import { getKeepsakeDesign } from '../data/keepsakes'
import { locations } from '../data/locations'
import { locationPaintings } from '../data/locationPaintings'
import { lodgeLayout } from '../data/lodgeLayout'
import { trophyRoomLayout } from '../data/trophyRoomLayout'
import { cabinCatalog, getCabinDefinition, includedCabinCosmetics } from '../data/cabinCatalog'
import { getOwnedCabinDecor, isDecorCompatible } from '../data/cabinDecor'
import { hasProductEntitlement } from '../data/storeCatalog'
import { useGame } from '../hooks/useGame'
import { createCabinShareImage } from '../utils/cabinShareImage'
import cabinImage from '../assets/locations/cabin.webp'
import lodgeImage from '../assets/locations/angler-lodge.png'
import riverstoneCabin from '../assets/locations/riverstone-cabin.jpg'
import cedarHideaway from '../assets/locations/cedar-hideaway.jpg'
import captainsRetreat from '../assets/locations/captains-retreat.jpg'
import workshopCabin from '../assets/locations/workshop-cabin.png'
import lakesideCottage from '../assets/locations/lakeside-cottage.png'
import coastalShack from '../assets/locations/coastal-shack.png'
import trophyRoom from '../assets/locations/trophy-room.png'
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

const cabinArtwork = {
  starter: cabinImage,
  'angler-lodge': lodgeImage,
  'riverstone-cabin': riverstoneCabin,
  'cedar-hideaway': cedarHideaway,
  'captains-retreat': captainsRetreat,
  'workshop-cabin': workshopCabin,
  'lakeside-cottage': lakesideCottage,
  'coastal-shack': coastalShack,
  'trophy-room': trophyRoom,
}

const DecorOverlay = ({ hook, item }) => <div
  className={`cabin-decor-overlay decor-${hook.type}${item.artworkKind ? ` decor-art-${item.artworkKind}` : ''}${item.displayTags?.includes('rod') ? ' decor-tag-rod' : ''}${item.displayTags?.includes('model-boat') ? ' decor-tag-model-boat' : ''}${item.displayTags?.includes('miniature') ? ' decor-tag-miniature' : ''}${item.presentation ? ` decor-presentation-${item.presentation}` : ''}`}
  style={{ '--decor-x': `${hook.bounds.x}%`, '--decor-y': `${hook.bounds.y}%`, '--decor-width': `${hook.bounds.width}%`, '--decor-height': `${hook.bounds.height}%`, '--decor-a': item.colors?.[0], '--decor-b': item.colors?.[1] }}
  title={`${hook.name}: ${item.name}`}
>
  {item.artwork && <img src={item.artwork} alt="" style={item.fit ? { objectFit: item.fit } : undefined}/>}<span>{hook.type === 'display' && !item.artwork ? item.name : ''}</span>
</div>

export default function CabinPage({ onGoFishing, returnLocationName = 'Backyard Pond' }) {
  const { game, actions } = useGame()
  const cabin = game.cabin
  const specimens = fish.map((item) => ({ fish: item, record: cabin.specimens[item.id] })).filter(({ record }) => record)
  const preservedFish = specimens.filter(({ record }) => record.mounted)
  const visitedLocations = locations.filter((location) => game.achievementProgress.locationsFished.includes(location.id))
  const legendaryCount = game.achievementProgress.legendaryLocations.length
  const lodgeUnlocked = legendaryCount >= 4
  const isLodge = cabin.styleId === 'angler-lodge' && lodgeUnlocked
  const isTrophyRoom = cabin.styleId === 'trophy-room'
  const activeCabin = getCabinDefinition(cabin.styleId) || getCabinDefinition('starter')
  const isStarter = activeCabin.id === 'starter'
  const activeCabinImage = cabinArtwork[activeCabin.id] || cabinImage
  const cabinChoices = cabinCatalog.filter((definition) => {
    if (definition.id === 'starter') return true
    if (definition.id === 'angler-lodge') return lodgeUnlocked
    if (definition.acquisition.type === 'coin-store') return game.coinStore.ownedItemIds.includes(definition.acquisition.productId)
    if (definition.acquisition.type === 'store') return hasProductEntitlement(game.commerce?.entitlementIds || [], definition.acquisition.productId)
    return false
  })
  const featuredFish = getFish(cabin.featuredFishId)
  const featuredSpecimen = cabin.specimens[cabin.featuredFishId]?.mounted
  const souvenir = locations.find((location) => location.id === cabin.souvenirLocationId)
  const earnedKeepsakes = achievements.filter((achievement) => game.achievements[achievement.id])
  const earnedKeepsakeKey = earnedKeepsakes.map((achievement) => achievement.id).join('|')
  const [shareImage, setShareImage] = useState(null)
  const [shareStatus, setShareStatus] = useState('')
  const legendaryFish = fish.filter((item) => item.rarity === 'legendary')
  const amazingPhotoFish = fish.filter((item) => game.achievementProgress.amazingPhotos.includes(item.id))
  const earnedCabinCollectibles = game.achievementProgress.upgradedSouvenirs.length + game.achievementProgress.equipmentPlaques.length + game.achievementProgress.amazingPhotos.length + game.achievementProgress.legendaryMiniatures.length
  const ownedDecor = getOwnedCabinDecor(game)
  const activeDecorSelections = cabin.decorByCabin[activeCabin.id] || {}
  const selectedDecor = (activeCabin.customizationHooks || []).map((hook) => {
    const selection = activeDecorSelections[hook.id]
    if (hook.type === 'frame') {
      const artwork = ownedDecor.find((entry) => entry.id === selection?.artworkId && entry.frameRole === 'artwork')
      const frame = ownedDecor.find((entry) => entry.id === selection?.frameId && entry.frameRole === 'treatment')
      if (!artwork && !frame) return null
      return { hook, item: { ...(frame || artwork), artwork: artwork?.artwork || null, artworkKind: artwork?.id.startsWith('earned.photo.') ? 'fish' : 'painting', colors: frame?.colors || artwork?.colors } }
    }
    const item = ownedDecor.find((entry) => entry.id === selection)
    return item ? { hook, item } : null
  }).filter(Boolean)
  const frameArtwork = ownedDecor.filter((item) => item.hookType === 'frame' && item.frameRole === 'artwork')
  const frameTreatments = ownedDecor.filter((item) => item.hookType === 'frame' && item.frameRole === 'treatment')
  const starterFrameOccupied = Boolean(activeDecorSelections['hearth-gallery']?.artworkId)
  const lodgeFrameOccupied = (index) => Boolean(activeDecorSelections[index === 0 ? 'left-gallery-frame' : index === 2 ? 'right-gallery-frame' : '']?.artworkId)

  useEffect(() => {
    let cancelled = false
    setShareImage(null)
    setShareStatus('')
    const displayIds = isLodge ? cabin.lodgeFeaturedFishIds.map((id, index) => lodgeFrameOccupied(index) ? null : id) : isTrophyRoom ? cabin.trophyRoomFeaturedFishIds : isStarter ? [starterFrameOccupied ? null : cabin.featuredFishId] : []
    const fishDisplays = displayIds.map((fishId) => fishId ? { fish: getFish(fishId), specimen: cabin.specimens[fishId]?.mounted } : null)
    createCabinShareImage({
      background: activeCabinImage,
      cabinName: activeCabin.name,
      fishDisplays,
      souvenir: isStarter && souvenir ? souvenirArtwork[souvenir.id] : null,
      keepsakes: earnedKeepsakes.map((achievement) => getKeepsakeDesign(achievement.id)),
      isLodge,
      isTrophyRoom,
      decor: selectedDecor,
    }).then((blob) => { if (!cancelled) setShareImage(blob) }).catch(() => { if (!cancelled) setShareStatus('Share image unavailable') })
    return () => { cancelled = true }
  }, [activeCabin.name, activeCabinImage, cabin.featuredFishId, cabin.lodgeFeaturedFishIds, cabin.trophyRoomFeaturedFishIds, cabin.specimens, cabin.decorByCabin, earnedKeepsakeKey, isLodge, isTrophyRoom, isStarter, souvenir])

  const shareCabin = async () => {
    if (!shareImage) return
    const cabinName = activeCabin.name
    const filename = `fishing-adventure-${activeCabin.id}.png`
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
    if (isTrophyRoom) {
      const existingIndex = cabin.trophyRoomFeaturedFishIds.indexOf(fishId)
      const emptyIndex = cabin.trophyRoomFeaturedFishIds.indexOf(null)
      return actions.setTrophyRoomDisplay(existingIndex >= 0 ? existingIndex : emptyIndex >= 0 ? emptyIndex : 0, fishId)
    }
    if (!isLodge) return actions.setCabinChoice('featuredFishId', fishId)
    const existingIndex = cabin.lodgeFeaturedFishIds.indexOf(fishId)
    const emptyIndex = cabin.lodgeFeaturedFishIds.indexOf(null)
    actions.setLodgeDisplay(existingIndex >= 0 ? existingIndex : emptyIndex >= 0 ? emptyIndex : 0, fishId)
  }

  return <main className="cabin-page">
    <div className="cabin-heading">
      <div><span className="eyebrow">A look back home</span><h2>{activeCabin.name}</h2><p>{activeCabin.description}</p></div>
      <div className="cabin-heading-actions"><button type="button" className="cabin-share-button" disabled={!shareImage} onClick={shareCabin}><Icon name="share" size={17}/>{shareImage ? 'Share cabin' : 'Preparing…'}</button><button type="button" className="secondary-button" onClick={onGoFishing}>Return to {returnLocationName}</button></div>
    </div>
    {shareStatus && <p className="cabin-share-status" role="status">{shareStatus}</p>}

    <section className="cabin-style-picker" aria-label="Cabin style">
      {cabinChoices.map((definition) => <button type="button" aria-pressed={cabin.styleId === definition.id} className={cabin.styleId === definition.id ? 'selected' : ''} onClick={() => actions.setCabinStyle(definition.id)} key={definition.id}><span>{definition.acquisition.type === 'included' ? 'Included' : definition.acquisition.type === 'earned' ? 'Earned' : definition.acquisition.type === 'store' ? 'Purchased' : 'Trading Post'}</span><strong>{definition.name}</strong></button>)}
    </section>

    {!isLodge && !isTrophyRoom ? <>
      <section className={`cabin-scene cabin-${activeCabin.id}`} style={{ '--cabin-art': `url("${activeCabinImage}")` }} aria-label={activeCabin.description}>
        {isStarter && !starterFrameOccupied && <div className="cabin-featured" aria-label={featuredFish ? `Preserved catch: ${featuredFish.name}` : 'Empty preserved catch mount'}>
          {featuredFish ? <div className={`cabin-mount size-${featuredSpecimen.sizeTier}`}><FishArtwork fishId={featuredFish.id} name={featuredFish.name} className="cabin-fish-art"/></div> : <span>Ready for<br/>a preserved catch</span>}
        </div>}
        {isStarter && souvenir && <img className="cabin-souvenir" src={souvenirArtwork[souvenir.id]} alt={`${souvenir.name} souvenir`}/>}
        {selectedDecor.map(({ hook, item }) => <DecorOverlay hook={hook} item={item} key={hook.id}/>)}
      </section>

      {isStarter && <section className="cabin-story" aria-label="Cabin displays">
        <article><span>Above the fire</span><strong>{featuredFish?.name || 'No preserved catch yet'}</strong>{featuredFish && <small>{featuredSpecimen.weight} lb · {featuredSpecimen.sizeTier === 'trophy' ? 'Trophy' : 'Great'} specimen</small>}</article>
        <article><span>On the shelf</span><strong>{souvenir ? `${souvenir.name} souvenir` : 'An open place for a travel memory'}</strong><small>{souvenir ? `A reminder of time spent at ${souvenir.name}` : 'Backyard Pond feels like home'}</small></article>
      </section>}
    </> : isLodge ? <>
      <section className="cabin-scene lodge-scene" style={{ '--cabin-art': `url("${lodgeImage}")` }} aria-label="The earned Angler's Lodge with three specimen mounts and a keepsake cabinet">
        {cabin.lodgeFeaturedFishIds.map((fishId, index) => {
          const mountedFish = getFish(fishId)
          const mounted = cabin.specimens[fishId]?.mounted
          const bounds = lodgeLayout.specimenMounts[index]
          return <div className={`lodge-mount ${mounted?.sizeTier === 'trophy' ? 'size-amazing' : ''}`} style={{ left: `${bounds.x}%`, top: `${bounds.y}%`, width: `${bounds.width}%`, height: `${bounds.height}%` }} key={index} aria-label={mountedFish ? `Preserved catch: ${mountedFish.name}` : `Empty lodge mount ${index + 1}`}>
            {mountedFish && !lodgeFrameOccupied(index) && <FishArtwork fishId={mountedFish.id} name={mountedFish.name} className="lodge-fish-art"/>}
          </div>
        })}
        {selectedDecor.map(({ hook, item }) => <DecorOverlay hook={hook} item={item} key={hook.id}/>)}
        <div className="lodge-keepsakes" style={{ left: `${lodgeLayout.keepsakeCabinet.x}%`, top: `${lodgeLayout.keepsakeCabinet.y}%`, width: `${lodgeLayout.keepsakeCabinet.width}%`, height: `${lodgeLayout.keepsakeCabinet.height}%`, gridTemplateColumns: `repeat(${lodgeLayout.keepsakeCabinet.columns},1fr)`, gridAutoRows: `${100 / lodgeLayout.keepsakeCabinet.rows}%` }} aria-label={`${earnedKeepsakes.length} of 20 Angling Keepsakes displayed`}>{Array.from({ length: 20 }, (_, index) => { const achievement = earnedKeepsakes[index]; if (!achievement) return <span className="empty" aria-hidden="true" key={`empty-${index}`}/>; const design = getKeepsakeDesign(achievement.id); return <span className={`material-${design.material}`} title={achievement.name} key={achievement.id}><Icon name={design.icon} size={18}/></span> })}</div>
      </section>
      <section className="lodge-story"><article><span>Legendary waters</span><strong>{legendaryCount} explored</strong><small>The lodge remains yours permanently.</small></article><article><span>Preserved displays</span><strong>{cabin.lodgeFeaturedFishIds.filter(Boolean).length} of 3 filled</strong><small>Choose any preserved Great or Trophy specimens.</small></article><article><span>Keepsake cabinet</span><strong>{earnedKeepsakes.length} earned</strong><small>Your Angling Keepsakes appear automatically.</small></article></section>
    </> : <>
      <section className="cabin-scene trophy-room-scene" style={{ '--cabin-art': `url("${trophyRoom}")` }} aria-label="The Grand Trophy Room with twelve preserved specimen mounts">
        {selectedDecor.map(({ hook, item }) => <DecorOverlay hook={hook} item={item} key={hook.id}/>)}
        {cabin.trophyRoomFeaturedFishIds.map((fishId, index) => {
          const mountedFish = getFish(fishId)
          const mounted = cabin.specimens[fishId]?.mounted
          const bounds = trophyRoomLayout.specimenMounts[index]
          return <div className={`trophy-room-mount ${index < 4 ? 'mount-hero' : 'mount-support'} ${mounted?.sizeTier === 'trophy' ? 'size-amazing' : ''}`} style={{ left: `${bounds.x}%`, top: `${bounds.y}%`, width: `${bounds.width}%`, height: `${bounds.height}%` }} key={index} aria-label={mountedFish ? `Preserved catch: ${mountedFish.name}` : `Empty trophy room mount ${index + 1}`}>
            {mountedFish && <FishArtwork fishId={mountedFish.id} name={mountedFish.name} className="trophy-room-fish-art"/>}
          </div>
        })}
      </section>
      <section className="lodge-story"><article><span>Grand gallery</span><strong>{cabin.trophyRoomFeaturedFishIds.filter(Boolean).length} of 12 filled</strong><small>Display any preserved Great or Trophy specimens.</small></article><article><span>Your catches</span><strong>{preservedFish.length} preserved</strong><small>The room provides display space, never the fish themselves.</small></article><article><span>Permanent room</span><strong>Always yours</strong><small>Restore the purchase on another Android device.</small></article></section>
    </>}

    {(isStarter || isLodge || isTrophyRoom) && <section className="cabin-customizer" aria-labelledby="cabin-customizer-title">
      <div><span className="eyebrow">Make it yours</span><h3 id="cabin-customizer-title">Cabin displays</h3><p>Everything here is yours to change whenever you like.</p></div>
      {isTrophyRoom ? cabin.trophyRoomFeaturedFishIds.map((fishId, index) => <label key={index}>Mount {index + 1}<select value={fishId || ''} onChange={(event) => actions.setTrophyRoomDisplay(index, event.target.value || null)}><option value="">Empty mount</option>{preservedFish.map(({ fish: item, record }) => <option value={item.id} disabled={cabin.trophyRoomFeaturedFishIds.includes(item.id) && fishId !== item.id} key={item.id}>{item.name} · {record.mounted.weight} lb</option>)}</select></label>) : !isLodge ? <>
        <label>Preserved display<select value={cabin.featuredFishId || ''} onChange={(event) => actions.setCabinChoice('featuredFishId', event.target.value || null)}><option value="">Empty mount</option>{preservedFish.map(({ fish: item, record }) => <option value={item.id} key={item.id}>{item.name} · {record.mounted.weight} lb</option>)}</select></label>
        <label>Travel souvenir<select value={cabin.souvenirLocationId} onChange={(event) => actions.setCabinChoice('souvenirLocationId', event.target.value)}>{visitedLocations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}</select></label>
      </> : cabin.lodgeFeaturedFishIds.map((fishId, index) => <label key={index}>Mount {index + 1}<select value={fishId || ''} onChange={(event) => actions.setLodgeDisplay(index, event.target.value || null)}><option value="">Empty mount</option>{preservedFish.map(({ fish: item, record }) => <option value={item.id} disabled={cabin.lodgeFeaturedFishIds.includes(item.id) && fishId !== item.id} key={item.id}>{item.name} · {record.mounted.weight} lb</option>)}</select></label>)}
    </section>}

    {!!activeCabin.customizationHooks?.length && <section className="cabin-customizer decor-customizer" aria-labelledby="decor-customizer-title">
      <div><span className="eyebrow">Authored placement</span><h3 id="decor-customizer-title">Cabin decor</h3><p>{activeCabin.customizationHooks.length} fixed hooks keep every choice aligned with this room. Included, earned, owned-equipment, and Trading Post pieces appear only where they fit.</p></div>
      <aside className="included-style-preview" aria-label="Included cabin styles">
        <div><strong>Included cabin collection</strong><span>Free to use wherever this room has a compatible slot</span></div>
        <div className="included-style-groups">{Object.entries(includedCabinCosmetics).map(([group, options]) => {
          const previewItems = options.map((option) => ({ option, decor: ownedDecor.find((item) => item.id === option.id) }))
          const groupAvailable = previewItems.some(({ decor }) => activeCabin.customizationHooks.some((hook) => isDecorCompatible(hook, decor)))
          return <section className={groupAvailable ? '' : 'unavailable'} key={group}><span>{group}<small>{groupAvailable ? 'Available here' : `No slot in ${activeCabin.name}`}</small></span>{previewItems.map(({ option, decor }) => {
            const available = activeCabin.customizationHooks.some((hook) => isDecorCompatible(hook, decor))
            return <article className={available ? '' : 'unavailable'} key={option.id}><i className={`included-preview-${group}`} style={{ '--preview-a': option.colors[0], '--preview-b': option.colors[1], '--preview-c': option.colors[2] || option.colors[1] }}/><strong>{option.name}</strong></article>
          })}</section>
        })}</div>
      </aside>
      {activeCabin.customizationHooks.map((hook) => {
        const compatible = ownedDecor.filter((item) => isDecorCompatible(hook, item))
        if (hook.type === 'frame') return <fieldset className="cabin-frame-controls" key={hook.id}><legend>{hook.name}</legend><label>Artwork<select value={activeDecorSelections[hook.id]?.artworkId || ''} onChange={(event) => actions.setCabinDecor(activeCabin.id, hook.id, event.target.value || null, 'artwork')}><option value="">No artwork</option>{frameArtwork.map((item) => <option value={item.id} key={item.id}>{item.name} · Earned</option>)}</select></label><label>Frame style<select value={activeDecorSelections[hook.id]?.frameId || ''} onChange={(event) => actions.setCabinDecor(activeCabin.id, hook.id, event.target.value || null, 'treatment')}><option value="">Cabin frame</option>{frameTreatments.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.source === 'included' ? 'Included' : 'Trading Post'}</option>)}</select></label></fieldset>
        return <label key={hook.id}>{hook.name}<select value={activeDecorSelections[hook.id] || ''} onChange={(event) => actions.setCabinDecor(activeCabin.id, hook.id, event.target.value || null)}><option value="">Use cabin default</option>{compatible.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.source === 'included' ? 'Included' : item.source === 'earned' ? 'Earned' : item.source === 'equipment' ? 'Owned gear' : 'Trading Post'}</option>)}</select></label>
      })}
    </section>}

    <details className="cabin-collection painting-collection">
      <summary><span><small>Earned wall art</small><strong>Painting Collection</strong></span><b>{game.achievementProgress.paintingsEarned.length} earned</b></summary>
      <section className="painting-gallery" aria-labelledby="painting-gallery-title">
      <div><span className="eyebrow">Earned cabin cosmetics</span><h3 id="painting-gallery-title">Location paintings</h3><p>Complete each water's story to earn its painting. Catch a Great or Trophy specimen of every local species to earn the permanent Master Angler frame.</p></div>
      <div className="painting-grid">{locationPaintings.map((painting) => {
        const earned = game.achievementProgress.paintingsEarned.includes(painting.locationId)
        const mastered = game.achievementProgress.masterFramesEarned.includes(painting.locationId)
        return <article className={`painting-card ${earned ? 'earned' : 'locked'} ${mastered ? 'mastered' : ''}`} key={painting.id}>
          <div className="painting-frame"><img src={painting.artwork} alt={earned ? `${painting.name}, an earned landscape` : ''}/>{mastered && <span><Icon name="crown-fish" size={16}/>Master Angler</span>}</div>
          <div><span>{mastered ? 'Master Angler frame' : earned ? 'Painting earned' : 'Not yet earned'}</span><h4>{earned ? painting.name : 'Unfinished journey'}</h4><p>{painting.description}</p></div>
        </article>
      })}</div>
      </section>
    </details>

    <details className="cabin-collection">
      <summary><span><small>Earned and included details</small><strong>Cabin Collection</strong></span><b>{earnedCabinCollectibles} earned</b></summary>
      <div className="cabin-collection-body">
        <section><h4>Upgraded travel souvenirs</h4><p>Complete a location's full species journal to earn its finished souvenir.</p><div className="souvenir-collection-grid">{locations.map((location) => {
          const earned = game.achievementProgress.upgradedSouvenirs.includes(location.id)
          return <article className={earned ? 'earned' : 'locked'} key={location.id}><div>{earned && <img src={souvenirArtwork[location.id]} alt=""/>}</div><span>{earned ? 'Journal complete' : 'Undiscovered'}</span><strong>{earned ? `${location.name} keepsake` : 'Unfinished souvenir'}</strong></article>
        })}</div></section>

        <section><h4>Trophy-catch photographs</h4><p>Every species with a recorded Trophy specimen earns a permanent cabin photograph.</p>{amazingPhotoFish.length ? <div className="photo-collection-grid">{amazingPhotoFish.map((item) => { const specimen = cabin.specimens[item.id]; const location = locations.find((entry) => entry.id === specimen.locationId); return <article key={item.id} style={{ '--photo-art': `url("${location?.image}")` }}><FishArtwork fishId={item.id} name={item.name} className="photo-fish"/><span>Trophy · {specimen.weight} lb</span><strong>{item.name}</strong><small>{location?.name}</small></article> })}</div> : <div className="cabin-collection-empty">Your first Trophy specimen will develop into a photograph here.</div>}</section>

        <section><h4>Legendary fish miniatures</h4><p>Discover a legendary species to earn its small handcrafted display figure.</p><div className="miniature-grid">{legendaryFish.map((item) => { const earned = game.achievementProgress.legendaryMiniatures.includes(item.id); return <article className={earned ? 'earned' : 'locked'} key={item.id}><FishArtwork fishId={item.id} name={earned ? item.name : undefined} hidden={!earned} className="miniature-fish"/><strong>{earned ? item.name : 'Unknown legend'}</strong></article> })}</div></section>

        <section><h4>Location-mastery equipment plaques</h4><p>Own every rod in a location's equipment family to earn its plaque.</p><div className="plaque-grid">{locations.map((location) => { const earned = game.achievementProgress.equipmentPlaques.includes(location.id); return <article className={earned ? 'earned' : 'locked'} key={location.id}><Icon name="fishing" size={25}/><div><span>{earned ? 'Equipment family complete' : 'Still outfitting'}</span><strong>{location.name}</strong></div></article> })}</div></section>

      </div>
    </details>

    <section className="specimen-workshop" aria-labelledby="specimen-title">
      <div><span className="eyebrow">Specimen preservation</span><h3 id="specimen-title">Exceptional catches</h3><p>The best Great or Trophy catch of each species is remembered here, even after it is sold.</p></div>
      {!specimens.length && <p className="specimen-empty">Your first Great or Trophy specimen will appear here.</p>}
      <div className="specimen-grid">{specimens.map(({ fish: item, record }) => {
        const canUpgrade = record.mounted && record.weight > record.mounted.weight
        const location = locations.find((entry) => entry.id === record.locationId)
        return <article className={`specimen-card ${record.sizeTier === 'trophy' ? 'size-amazing' : 'size-great'}`} key={item.id}>
          <FishArtwork fishId={item.id} name={item.name} className="specimen-art"/>
          <div><span>{record.sizeTier === 'trophy' ? 'Trophy specimen' : 'Great specimen'}</span><h4>{item.name}</h4><p>{record.weight} lb · {location?.name || 'Unknown water'}</p>{record.mounted && <small>Preserved at {record.mounted.weight} lb</small>}</div>
          {!record.mounted && <button type="button" disabled={game.coins < GAME_CONFIG.trophyPreservationCost} onClick={() => actions.preserveSpecimen(item.id)}>Preserve · {GAME_CONFIG.trophyPreservationCost} coins</button>}
          {canUpgrade && <button type="button" onClick={() => actions.preserveSpecimen(item.id)}>Upgrade mount · Free</button>}
          {record.mounted && !canUpgrade && <button type="button" className="secondary-button" onClick={() => displaySpecimen(item.id)}>Display</button>}
        </article>
      })}</div>
    </section>
  </main>
}
