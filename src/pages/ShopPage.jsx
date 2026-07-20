import { useState } from 'react'
import Icon from '../components/Icon'
import { coinStoreItems } from '../data/coinStoreCatalog'
import { getCabinDefinition } from '../data/cabinCatalog'
import { getRodsForLocation } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { giveFeedback } from '../services/feedbackService'
import '../styles/shop.css'
import riverstoneCabin from '../assets/locations/riverstone-cabin.jpg'
import cedarHideaway from '../assets/locations/cedar-hideaway.jpg'
import captainsRetreat from '../assets/locations/captains-retreat.jpg'

const cabinArtwork = {
  'riverstone-cabin': riverstoneCabin,
  'cedar-hideaway': cedarHideaway,
  'captains-retreat': captainsRetreat,
}

const categoryNames = {
  cabin: 'Cabin',
  rug: 'Cabin rug',
  frame: 'Display frame',
  finish: 'Timber finish',
  'cabin-decor': 'Cabin detail',
  prestige: 'Bragging rights',
}

export default function ShopPage({ location }) {
  const { game, actions } = useGame()
  const [section, setSection] = useState('rods')
  const rods = getRodsForLocation(location.id)
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

  return <main className="content-page shop-page">
    <div className="page-heading"><div><span className="eyebrow">Outfitter & cabin goods</span><h2>Trading Post</h2><p>Upgrade your tackle or spend your hard-earned coins on permanent cabin comforts.</p></div></div>
    <div className="shop-tabs" role="tablist" aria-label="Trading Post departments">
      <button type="button" role="tab" aria-selected={section === 'rods'} className={section === 'rods' ? 'selected' : ''} onClick={() => setSection('rods')}>Rod Shop</button>
      <button type="button" role="tab" aria-selected={section === 'decor'} className={section === 'decor' ? 'selected' : ''} onClick={() => setSection('decor')}>Cabins & Decor</button>
    </div>

    {section === 'rods' ? <>
      <div className="shop-section-heading"><span className="eyebrow">{location.name} outfitter</span><h3>{isFlyShop ? 'Fly Rod Shop' : 'Rod Shop'}</h3></div>
      <div className="shop-grid">{rods.map((rod, index) => {
        const owned = gear.ownedRods.includes(rod.id)
        const equipped = gear.equippedRod === rod.id
        const affordable = game.coins >= rod.price
        const prerequisiteMet = !rod.previousId || gear.ownedRods.includes(rod.previousId)
        const rareChance = rod.chances.rare + rod.chances.epic + rod.chances.legendary
        let buttonLabel = `Buy · ${rod.price.toLocaleString()} coins`
        if (!prerequisiteMet) buttonLabel = 'Previous rod required'
        else if (!affordable) buttonLabel = `Need ${(rod.price - game.coins).toLocaleString()} more`

        return <article className={`shop-card ${equipped ? 'equipped' : ''}`} key={rod.id}><div className="rod-art"><img src={rod.image} alt="" draggable="false"/></div><div><span className="eyebrow">{index === 0 ? 'Well loved' : index === rods.length - 1 ? 'Finest quality' : 'Rod upgrade'}</span><h3>{rod.name}</h3><p>{rod.description}</p><div className="odds"><span>Rare+ chance</span><b>{rareChance.toFixed(1)}%</b></div><div className="odds"><span>Line control</span><b>{rod.lineControl ? `+${Math.round(rod.lineControl * 100)}%` : 'Basic'}</b></div></div>{equipped ? <button disabled>Equipped</button> : owned ? <button onClick={() => actions.equipRod(rod.id, location.id)}>Equip rod</button> : <button disabled={!affordable || !prerequisiteMet} onClick={() => buyRod(rod.id)}>{buttonLabel}</button>}</article>
      })}</div>
    </> : <>
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
    </>}
  </main>
}
