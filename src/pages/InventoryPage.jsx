import Icon from '../components/Icon'
import RarityBadge from '../components/RarityBadge'
import { useGame } from '../hooks/useGame'

export default function InventoryPage() {
  const { game, actions } = useGame()
  const totalValue = game.inventory.reduce((sum, item) => sum + item.value, 0)
  return <main className="content-page"><div className="page-heading"><div><span className="eyebrow">Your keep</span><h2>Fishing Basket</h2><p>{game.inventory.length} fish · {totalValue} coins in value</p></div><button className="secondary-button" disabled={!game.inventory.length} onClick={actions.sellAll}>Sell all</button></div>{!game.inventory.length ? <div className="empty"><div className="empty-icon"><Icon name="fish" size={48}/></div><h3>Your basket is empty</h3><p>Head to the pond and cast a line. Your catches will wait here.</p></div> : <div className="card-list">{game.inventory.map((item) => <article className="item-card" key={item.catchId}><div className="item-art"><Icon name="fish" size={30}/></div><div className="item-info"><h3>{item.name}</h3><RarityBadge rarity={item.rarity}/><p>{item.weight} lb</p></div><button className="sell-button" onClick={() => actions.sell(item.catchId)} aria-label={`Sell ${item.name} for ${item.value} coins`}><b>{item.value}</b><span>Sell</span></button></article>)}</div>}</main>
}
