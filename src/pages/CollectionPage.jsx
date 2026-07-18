import { useEffect, useState } from 'react'
import RarityBadge from '../components/RarityBadge'
import FishArtwork from '../components/FishArtwork'
import { fish } from '../data/fish'
import { useGame } from '../hooks/useGame'
import FishJournalPage from './FishJournalPage'

export default function CollectionPage() {
  const { game } = useGame()
  const [selectedFish, setSelectedFish] = useState(null)
  const discovered = fish.filter((item) => game.collection[item.id]?.count).length
  const percent = Math.round((discovered / fish.length) * 100)

  useEffect(() => {
    if (selectedFish) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedFish])

  if (selectedFish) return <FishJournalPage fish={selectedFish} record={game.collection[selectedFish.id]} onBack={() => setSelectedFish(null)}/>

  return <main className="content-page"><div className="page-heading"><div><span className="eyebrow">Willow Pond journal</span><h2>Fish Collection</h2><p>{discovered} of {fish.length} fish discovered</p></div><div className="progress-ring" style={{ '--progress': `${(discovered / fish.length) * 360}deg` }} aria-label={`${percent}% complete`}><span>{percent}%</span></div></div><div className="collection-grid">{fish.map((item) => { const record = game.collection[item.id]; return record ? <article className="collection-card collection-card-button" key={item.id}><button type="button" className="collection-card-hit" onClick={() => setSelectedFish(item)} aria-label={`Open journal entry for ${item.name}`}/><FishArtwork fishId={item.id} name={item.name} className="collection-fish-art"/><RarityBadge rarity={item.rarity}/><h3>{item.name}</h3><p>{item.description}</p><footer><span>Best <b>{record.largestWeight} lb</b></span><span>Caught <b>{record.count}</b></span></footer><span className="collection-open">Read journal <span aria-hidden="true">→</span></span></article> : <article className="collection-card hidden" key={item.id}><FishArtwork fishId={item.id} hidden className="collection-fish-art"/><span className="rarity unknown-label">Undiscovered</span><h3>Unknown fish</h3><p>Keep fishing to reveal this pond resident.</p></article> })}</div></main>
}
