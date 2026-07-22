import { useState } from 'react'
import Icon from '../components/Icon'
import { coinStoreItems } from '../data/coinStoreCatalog'
import { getCabinDefinition } from '../data/cabinCatalog'
import { getRodsForLocation } from '../data/rods'
import { getLuresForLocation } from '../data/waterSetup'
import { getFish } from '../data/fish'
import { useGame } from '../hooks/useGame'
import { giveFeedback } from '../services/feedbackService'
import { preparedStoreProducts } from '../data/storeCatalog'
import { getBoatCosmetic, getBoatCosmetics, isBoatCosmeticOwned } from '../data/boatCosmetics'
import '../styles/shop.css'
import riverstoneCabin from '../assets/locations/riverstone-cabin.jpg'
import cedarHideaway from '../assets/locations/cedar-hideaway.jpg'
import captainsRetreat from '../assets/locations/captains-retreat.jpg'
import workshopCabin from '../assets/locations/workshop-cabin.png'
import lakesideCottage from '../assets/locations/lakeside-cottage.png'
import coastalShack from '../assets/locations/coastal-shack.png'
import trophyRoom from '../assets/locations/trophy-room.png'

const cabinArtwork = {
  'riverstone-cabin': riverstoneCabin,
  'cedar-hideaway': cedarHideaway,
  'captains-retreat': captainsRetreat,
  'cabin.workshop': workshopCabin,
  'cabin.lakeside_cottage': lakesideCottage,
  'cabin.coastal_shack': coastalShack,
  'cabin.trophy_room': trophyRoom,
}

const categoryNames = {
  cabin: 'Cabin',
  frame: 'Display frame',
  finish: 'Timber finish',
  'cabin-decor': 'Cabin detail',
  prestige: 'Bragging rights',
}

const boatStyleProducts = {
  'boat_style.great_lake_classics': { boatId: 'great-lake-skiff', previewId: 'great-lake-midnight' },
  'boat_style.gulf_coast_colors': { boatId: 'gulf-coast-bay-skiff', previewId: 'gulf-coast-sunset-coral' },
}

export default function ShopPage({ location }) {
  const { game, actions, commerce } = useGame()
  const [section, setSection] = useState('rods')
  const rods = getRodsForLocation(location.id)
  const lures = getLuresForLocation(location.id)
  const gear = game.gearByLocation[location.id]
  const isFlyShop = location.fishingStyle === 'fly'

  const buyRod = (rodId) => {
    giveFeedback('purchase', game.settings)
    actions.buyRod(rodId, location.id)
  }

  const buyTradingPostItem = (item) => {
    giveFeedback('purchase', game.settings)
    actions.buyCoinStoreItem(item.id)
  }

  const buyLure = (lure) => {
    giveFeedback('purchase', game.settings)
    actions.buyLure(lure.id)
  }

  return <main className="content-page shop-page">
    <div className="page-heading"><div><span className="eyebrow">Outfitter & cabin goods</span><h2>Trading Post</h2><p>Upgrade your tackle or spend your hard-earned coins on permanent cabin comforts.</p></div></div>
    <div className="shop-tabs" role="tablist" aria-label="Trading Post departments">
      <button type="button" role="tab" aria-selected={section === 'rods'} className={section === 'rods' ? 'selected' : ''} onClick={() => setSection('rods')}>Rod Shop</button>
      <button type="button" role="tab" aria-selected={section === 'lures'} className={section === 'lures' ? 'selected' : ''} onClick={() => setSection('lures')}>Lure Shop</button>
      <button type="button" role="tab" aria-selected={section === 'decor'} className={section === 'decor' ? 'selected' : ''} onClick={() => setSection('decor')}>Cabins & Decor</button>
      <button type="button" role="tab" aria-selected={section === 'support'} className={section === 'support' ? 'selected' : ''} onClick={() => setSection('support')}>Cabin Store</button>
    </div>

    {section === 'rods' ? <>
      <div className="shop-section-heading"><span className="eyebrow">{location.name} outfitter</span><h3>{isFlyShop ? 'Fly Rod Shop' : 'Rod Shop'}</h3></div>
      <div className="shop-grid">{rods.map((rod, index) => {
        const owned = gear.ownedRods.includes(rod.id)
        const equipped = gear.equippedRod === rod.id
        const affordable = game.coins >= rod.price
        const prerequisiteMet = !rod.previousId || gear.ownedRods.includes(rod.previousId)
        const rareChance = (rod.chances.rare + rod.chances.epic + rod.chances.legendary) * (1 - rod.quietCastChance / 100)
        let buttonLabel = `Buy · ${rod.price.toLocaleString()} coins`
        if (!prerequisiteMet) buttonLabel = 'Previous rod required'
        else if (!affordable) buttonLabel = `Need ${(rod.price - game.coins).toLocaleString()} more`

        return <article className={`shop-card ${equipped ? 'equipped' : ''}`} key={rod.id}><div className="rod-art"><img src={rod.image} alt="" draggable="false"/></div><div><span className="eyebrow">{index === 0 ? 'Well loved' : index === rods.length - 1 ? 'Finest quality' : 'Rod upgrade'}</span><h3>{rod.name}</h3><p>{rod.description}</p><div className="odds"><span>Effective Rare+ chance</span><b>{rareChance.toFixed(1)}%</b></div><div className="odds"><span>Quiet cast chance</span><b>{rod.quietCastChance}%</b></div><div className="odds"><span>Line control</span><b>{rod.lineControl ? `+${Math.round(rod.lineControl * 100)}%` : 'Basic'}</b></div></div>{equipped ? <button disabled>Equipped</button> : owned ? <button onClick={() => actions.equipRod(rod.id, location.id)}>Equip rod</button> : <button disabled={!affordable || !prerequisiteMet} onClick={() => buyRod(rod.id)}>{buttonLabel}</button>}</article>
      })}</div>
    </> : section === 'lures' ? <>
      <div className="shop-section-heading"><span className="eyebrow">{location.name} tackle</span><h3>Reusable Lures</h3><p>Included tackle is always available. Affordable target tackle adds 5% relative affinity to a fish group; legendary tackle adds 20% to one fish.</p></div>
      <div className="lure-shop-grid">{lures.map((lure) => {
        const owned = lure.included || game.tackle.ownedLureIds.includes(lure.id)
        const equipped = game.fishingSetupByLocation[location.id]?.lureId === lure.id
        const affordable = lure.included || game.coins >= lure.price
        const targets = (lure.targetFishIds || []).map(getFish).filter(Boolean)
        const affinityPercent = Math.round(((lure.affinity || 1) - 1) * 100)
        const targetLabel = targets.map((fishItem) => fishItem.name).join(', ')
        return <article className={`lure-shop-card${equipped ? ' equipped' : ''}`} key={lure.id}>
          <div className="lure-shop-mark" aria-hidden="true">{targets.length ? '◎' : '◇'}</div><div><span className="eyebrow">{lure.included ? 'Included tackle' : affinityPercent >= 20 ? 'Legendary target' : 'Target tackle'}</span><h3>{lure.name}</h3><p>{lure.description}</p>{targets.length > 0 && <div className="lure-affinity"><span>{targets.length > 1 ? 'Targets' : 'Target'}</span><b>{targetLabel} · +{affinityPercent}% affinity</b></div>}</div>
          {equipped ? <button disabled>Equipped</button> : owned ? <button onClick={() => actions.setFishingSetup(location.id, 'lure', lure.id)}>Equip lure</button> : <button disabled={!affordable} onClick={() => buyLure(lure)}>{affordable ? `Buy · ${lure.price.toLocaleString()}` : `Need ${(lure.price - game.coins).toLocaleString()} more`}</button>}
        </article>
      })}</div>
    </> : section === 'decor' ? <>
      <div className="shop-section-heading"><span className="eyebrow">Earned-coin collection</span><h3>Cabins & Decor</h3><p>Everything here is permanent, purely decorative, and paid for with coins earned while fishing.</p></div>
      <div className="trading-post-grid">{coinStoreItems.map((item) => {
        const owned = game.coinStore.ownedItemIds.includes(item.id)
        const affordable = game.coins >= item.price
        const artwork = item.cabinId ? cabinArtwork[item.cabinId] : null
        const cabinDefinition = item.cabinId ? getCabinDefinition(item.cabinId) : null
        const customizationHooks = cabinDefinition?.customizationHooks?.length || cabinDefinition?.slots.reduce((total, slot) => total + slot.capacity, 0) || 0
        return <article className={`trading-post-card tier-${item.tier} ${owned ? 'owned' : ''}`} key={item.id}>
          <div className={`trading-post-art category-${item.category} ${item.artwork ? 'decor-preview' : ''}`}>{artwork || item.artwork ? <img src={artwork || item.artwork} alt={`${item.name} preview`} draggable="false"/> : <Icon name={item.category === 'prestige' ? 'crown-fish' : 'shop'} size={34}/>}</div>
          <div className="trading-post-copy"><span>{categoryNames[item.category]}</span><h3>{item.name}</h3><p>{item.description || `An optional ${categoryNames[item.category].toLowerCase()} for personalizing your cabin.`}</p></div>
          {cabinDefinition && <div className="cabin-hook-count"><Icon name="collection" size={17}/><span><strong>{customizationHooks}</strong> customization hooks</span></div>}
          <div className="trading-post-price"><span>{item.tier}</span><strong>{item.price.toLocaleString()} coins</strong></div>
          <button type="button" disabled={owned || !affordable} onClick={() => buyTradingPostItem(item)}>{owned ? 'Owned' : affordable ? `Buy · ${item.price.toLocaleString()}` : `Need ${(item.price - game.coins).toLocaleString()} more`}</button>
        </article>
      })}</div>
    </> : <>
      <div className="shop-section-heading"><span className="eyebrow">Optional purchases</span><h3>Cabins & Support</h3><p>Premium cabins are permanent cosmetics. Supporter packs are simply different contribution amounts with the same thank-you recognition—nothing here improves fishing or progress.</p></div>
      {commerce.provider === 'mock' && <p className="iap-sandbox-note" role="status">Development sandbox: purchases here use no real money and exist only in this browser.</p>}
      {commerce.message && <p className="iap-store-message" role="status">{commerce.message}</p>}
      <div className="iap-actions"><button type="button" className="secondary-button" disabled={!commerce.available || commerce.status === 'restoring'} onClick={actions.restoreStorePurchases}>{commerce.status === 'restoring' ? 'Restoring…' : 'Restore purchases'}</button></div>
      {!commerce.available && commerce.status !== 'loading' && <div className="empty"><Icon name="shop" size={42}/><h3>Cabin Store unavailable</h3><p>Real-money purchases are available through the Android app when Google Play is connected. The earned-coin Trading Post remains fully available.</p></div>}
      {commerce.status === 'loading' ? <div className="empty"><h3>Connecting to the store…</h3><p>Checking product availability and previous purchases.</p></div> : commerce.available && <div className="iap-store-grid">{preparedStoreProducts.map((product) => {
        const platformProduct = commerce.products.find((item) => item.id === product.id)
        const owned = commerce.ownedProductIds.includes(product.id)
        const pending = commerce.pendingProductId === product.id
        const isSupporter = product.category === 'supporter'
        const boatStyle = boatStyleProducts[product.id]
        const isBoatStyle = Boolean(boatStyle)
        const boatOwned = !isBoatStyle || game.watercraft.ownedBoatIds.includes(boatStyle.boatId)
        const boatPreview = isBoatStyle ? getBoatCosmetic(boatStyle.previewId)?.image : null
        const equippedCosmeticId = isBoatStyle ? game.watercraft.cosmeticByBoat[boatStyle.boatId] : null
        const cosmeticOptions = isBoatStyle ? getBoatCosmetics(boatStyle.boatId).filter((cosmetic) => isBoatCosmeticOwned(game, cosmetic)) : []
        return <article className={`iap-store-card${owned ? ' owned' : ''}`} key={product.id}>
          {isSupporter ? <div className="iap-supporter-art" aria-hidden="true"><Icon name="crown-fish" size={52}/><span>Thank you</span></div> : <div className={`iap-store-art${isBoatStyle ? ' boat-style-preview' : ''}`}><img src={boatPreview || cabinArtwork[product.id]} alt={`${product.name} preview`} draggable="false"/></div>}
          <div><span className="eyebrow">{isSupporter ? 'Choose your support level' : isBoatStyle ? 'Permanent boat cosmetics' : 'Permanent cabin'}</span><h3>{product.name}</h3><p>{product.description}</p>{isSupporter && <small>No extra gameplay benefit for choosing a higher level.</small>}{isBoatStyle && <small>{boatOwned ? 'Appearance only. Your original hull finish always remains available.' : 'Earn this boat with fishing coins before buying its cosmetic pack.'}</small>}</div>
          <div className="iap-store-price"><span>One-time purchase</span><strong>{platformProduct?.price || 'Unavailable'}</strong></div>
          <button type="button" disabled={owned || pending || !platformProduct?.available || !boatOwned} onClick={() => actions.purchaseStoreProduct(product.id)}>{owned ? 'Owned' : !boatOwned ? 'Earn boat first' : pending ? 'Waiting for Google Play…' : platformProduct?.available ? `Buy · ${platformProduct.price}` : 'Not available'}</button>
          {isBoatStyle && owned && boatOwned && <label className="boat-style-selector">Hull finish<select value={equippedCosmeticId} onChange={(event) => actions.setBoatCosmetic(boatStyle.boatId, event.target.value)}>{cosmeticOptions.map((cosmetic) => <option value={cosmetic.id} key={cosmetic.id}>{cosmetic.name}{cosmetic.included ? ' · Included' : ''}</option>)}</select></label>}
        </article>
      })}</div>}
      <p className="iap-policy-note">Purchases are processed by Google Play. Use Restore purchases after reinstalling or changing devices. No purchase grants fishing power, coins, catch odds, or earned rewards. Fishing Adventure has no ads.</p>
    </>}
  </main>
}
