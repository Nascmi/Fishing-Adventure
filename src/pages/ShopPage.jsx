import { getRodsForLocation } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { giveFeedback } from '../services/feedbackService'

export default function ShopPage({ location }) {
  const { game, actions } = useGame()
  const rods = getRodsForLocation(location.id)
  const gear = game.gearByLocation[location.id]
  const isFlyShop = location.fishingStyle === 'fly'

  const buyRod = (rodId) => {
    giveFeedback('purchase', game.settings)
    actions.buyRod(rodId, location.id)
  }

  return <main className="content-page"><div className="page-heading"><div><span className="eyebrow">{location.name} outfitter</span><h2>{isFlyShop ? 'Fly Rod Shop' : 'Rod Shop'}</h2><p>{isFlyShop ? 'River-specific fly rods improve rare-fish odds and line control.' : 'Better gear improves rare-fish odds and line control.'}</p></div></div><div className="shop-grid">{rods.map((rod, index) => {
    const owned = gear.ownedRods.includes(rod.id)
    const equipped = gear.equippedRod === rod.id
    const affordable = game.coins >= rod.price
    const prerequisiteMet = !rod.previousId || gear.ownedRods.includes(rod.previousId)
    const rareChance = rod.chances.rare + rod.chances.epic + rod.chances.legendary
    let buttonLabel = `Buy · ${rod.price.toLocaleString()} coins`
    if (!prerequisiteMet) buttonLabel = 'Previous rod required'
    else if (!affordable) buttonLabel = `Need ${rod.price.toLocaleString()} coins`

    return <article className={`shop-card ${equipped ? 'equipped' : ''}`} key={rod.id}><div className="rod-art"><img src={rod.image} alt="" draggable="false"/></div><div><span className="eyebrow">{index === 0 ? 'Well loved' : index === rods.length - 1 ? 'Finest quality' : 'Rod upgrade'}</span><h3>{rod.name}</h3><p>{rod.description}</p><div className="odds"><span>Rare+ chance</span><b>{rareChance.toFixed(1)}%</b></div><div className="odds"><span>Line control</span><b>{rod.lineControl ? `+${Math.round(rod.lineControl * 100)}%` : 'Basic'}</b></div></div>{equipped ? <button disabled>Equipped</button> : owned ? <button onClick={() => actions.equipRod(rod.id, location.id)}>Equip rod</button> : <button disabled={!affordable || !prerequisiteMet} onClick={() => buyRod(rod.id)}>{buttonLabel}</button>}</article>
  })}</div></main>
}
