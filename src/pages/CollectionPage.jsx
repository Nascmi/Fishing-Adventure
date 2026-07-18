import Icon from '../components/Icon'
import RarityBadge from '../components/RarityBadge'
import { fish } from '../data/fish'
import { useGame } from '../hooks/useGame'

export default function CollectionPage() {
  const { game } = useGame()
  const discovered = fish.filter((item) => game.collection[item.id]?.count).length
  const percent = Math.round((discovered / fish.length) * 100)
  return <main className="content-page"><div className="page-heading"><div><span className="eyebrow">Willow Pond journal</span><h2>Fish Collection</h2><p>{discovered} of {fish.length} fish discovered</p></div><div className="progress-ring" style={{ '--progress': `${(discovered / fish.length) * 360}deg` }} aria-label={`${percent}% complete`}><span>{percent}%</span></div></div><div className="collection-grid">{fish.map((item) => { const record = game.collection[item.id]; return record ? <article className="collection-card" key={item.id}><div className="collection-art"><Icon name="fish" size={34}/></div><RarityBadge rarity={item.rarity}/><h3>{item.name}</h3><p>{item.description}</p><footer><span>Best <b>{record.largestWeight} lb</b></span><span>Caught <b>{record.count}</b></span></footer></article> : <article className="collection-card hidden" key={item.id}><div className="unknown">?</div><span className="rarity unknown-label">Undiscovered</span><h3>Unknown fish</h3><p>Keep fishing to reveal this pond resident.</p></article> })}</div></main>
}
