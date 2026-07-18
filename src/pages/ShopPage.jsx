import { rods } from '../data/rods'
import { useGame } from '../hooks/useGame'
import { giveFeedback } from '../services/feedbackService'

export default function ShopPage() {
  const { game, actions } = useGame()
  const buyRod = (rodId) => {
    giveFeedback('purchase', game.settings)
    actions.buyRod(rodId)
  }
  return <main className="content-page"><div className="page-heading"><div><span className="eyebrow">Tackle & gear</span><h2>Rod Shop</h2><p>Better gear improves rare-fish odds and line control.</p></div></div><div className="shop-grid">{rods.map((rod, index) => { const owned = game.ownedRods.includes(rod.id); const equipped = game.equippedRod === rod.id; const affordable = game.coins >= rod.price; const rareChance = rod.chances.rare + rod.chances.epic + rod.chances.legendary; return <article className={`shop-card ${equipped ? 'equipped' : ''}`} key={rod.id}><div className="rod-art"><img src={rod.image} alt="" draggable="false"/></div><div><span className="eyebrow">{index === 0 ? 'Well loved' : index === 3 ? 'Finest quality' : 'Rod upgrade'}</span><h3>{rod.name}</h3><p>{rod.description}</p><div className="odds"><span>Rare+ chance</span><b>{rareChance.toFixed(1)}%</b></div><div className="odds"><span>Line control</span><b>{rod.lineControl ? `+${Math.round(rod.lineControl * 100)}%` : 'Basic'}</b></div></div>{equipped ? <button disabled>Equipped</button> : owned ? <button onClick={() => actions.equipRod(rod.id)}>Equip rod</button> : <button disabled={!affordable} onClick={() => buyRod(rod.id)}>{affordable ? `Buy · ${rod.price.toLocaleString()} coins` : `Need ${rod.price.toLocaleString()} coins`}</button>}</article> })}</div></main>
}
