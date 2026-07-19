import { useEffect, useState } from 'react'
import FishArtwork from '../components/FishArtwork'
import RarityBadge from '../components/RarityBadge'
import { fish } from '../data/fish'
import { useGame } from '../hooks/useGame'
import FishJournalPage from './FishJournalPage'
import { achievements } from '../data/achievements'
import Icon from '../components/Icon'

export default function CollectionPage() {
  const { game } = useGame()
  const [selectedFish, setSelectedFish] = useState(null)
  const [view, setView] = useState('journal')
  const discovered = fish.filter((item) => game.collection[item.id]?.count).length
  const percent = Math.round((discovered / fish.length) * 100)
  const keepsakesEarned = Object.keys(game.achievements).length

  useEffect(() => {
    if (selectedFish) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedFish])

  if (selectedFish) {
    return <FishJournalPage fish={selectedFish} record={game.collection[selectedFish.id]} onBack={() => setSelectedFish(null)}/>
  }

  return <main className="content-page">
    <div className="collection-tabs" role="tablist" aria-label="Collection views">
      <button type="button" role="tab" aria-selected={view === 'journal'} className={view === 'journal' ? 'active' : ''} onClick={() => setView('journal')}>Fish Journal</button>
      <button type="button" role="tab" aria-selected={view === 'keepsakes'} className={view === 'keepsakes' ? 'active' : ''} onClick={() => setView('keepsakes')}>Angling Keepsakes</button>
    </div>
    {view === 'keepsakes' ? <>
      <div className="page-heading keepsake-heading"><div><span className="eyebrow">Stories worth remembering</span><h2>Angling Keepsakes</h2><p>{keepsakesEarned} of {achievements.length} keepsakes earned · permanent and unhurried</p></div><div className="keepsake-count"><Icon name="keepsake" size={27}/><b>{keepsakesEarned}</b></div></div>
      <div className="keepsake-grid">{achievements.map((achievement) => {
        const record = game.achievements[achievement.id]
        const hidden = achievement.hidden && !record
        return <article className={`keepsake-card ${record ? 'earned' : 'locked'}`} key={achievement.id}>
          <div className="keepsake-medallion"><Icon name="keepsake" size={31}/></div>
          <div><span>{record ? `Earned ${new Date(record.unlockedAt).toLocaleDateString()}` : 'Not yet earned'}</span><h3>{hidden ? 'Hidden Keepsake' : achievement.name}</h3><p>{hidden ? 'Some fishing stories reveal themselves in their own time.' : record && achievement.unlockedDescription ? achievement.unlockedDescription : achievement.description}</p>{record && <blockquote>{achievement.flavor}</blockquote>}</div>
        </article>
      })}</div>
    </> : <>
    <div className="page-heading">
      <div>
        <span className="eyebrow">Angler’s journal</span>
        <h2>Fish Collection</h2>
        <p>{discovered} of {fish.length} fish discovered</p>
      </div>
      <div className="progress-ring" style={{ '--progress': `${(discovered / fish.length) * 360}deg` }} aria-label={`${percent}% complete`}>
        <span>{percent}%</span>
      </div>
    </div>

    <div className="collection-grid">{fish.map((item) => {
      const record = game.collection[item.id]
      if (!record) return <article className="collection-card hidden" key={item.id}>
        <FishArtwork fishId={item.id} hidden className="collection-fish-art"/>
        <span className="rarity unknown-label">Undiscovered</span>
        <h3>Unknown fish</h3>
        <p>Explore every fishing spot to reveal this species.</p>
      </article>

      return <article className="collection-card collection-card-button" key={item.id}>
        <button type="button" className="collection-card-hit" onClick={() => setSelectedFish(item)} aria-label={`Open journal entry for ${item.name}`}/>
        <FishArtwork fishId={item.id} name={item.name} className="collection-fish-art"/>
        <RarityBadge rarity={item.rarity}/>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <footer><span>Best <b>{record.largestWeight} lb</b></span><span>Caught <b>{record.count}</b></span></footer>
        <span className="collection-open">Read journal <span aria-hidden="true">→</span></span>
      </article>
    })}</div></>}
  </main>
}
