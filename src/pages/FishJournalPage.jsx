import FishArtwork from '../components/FishArtwork'
import RarityBadge from '../components/RarityBadge'

export default function FishJournalPage({ fish, record, onBack }) {
  return <main className="journal-page">
    <button className="journal-back" onClick={onBack} aria-label="Back to fish collection">
      <span aria-hidden="true">←</span> Collection
    </button>

    <article className="journal-entry">
      <header className="journal-hero">
        <span className="eyebrow">Angler’s journal entry</span>
        <FishArtwork fishId={fish.id} name={fish.name} className="journal-fish-art"/>
      </header>

      <div className="journal-body">
        <RarityBadge rarity={fish.rarity}/>
        <h2>{fish.name}</h2>
        <p className="journal-flavor">“{fish.journal}”</p>

        <dl className="journal-facts">
          <div><dt>Habitat</dt><dd>{fish.habitat}</dd></div>
          <div><dt>Typical size</dt><dd>{fish.typicalSize}</dd></div>
        </dl>

        <section className="journal-records" aria-labelledby="personal-records-title">
          <span className="eyebrow">Your time together</span>
          <h3 id="personal-records-title">Personal records</h3>
          <div>
            <p><span>Largest caught</span><strong>{record.largestWeight} lb</strong></p>
            <p><span>Number caught</span><strong>{record.count}</strong></p>
          </div>
        </section>
      </div>
    </article>
  </main>
}
