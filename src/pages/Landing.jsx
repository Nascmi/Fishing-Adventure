import { useEffect } from 'react'
import Icon from '../components/Icon'
import pondImage from '../assets/locations/willow-pond.webp'
import riverImage from '../assets/locations/pine-river.webp'
import lakeImage from '../assets/locations/great-lake.webp'
import coastImage from '../assets/locations/gulf-coast.webp'
import gulfImage from '../assets/locations/open-gulf.png'
import lodgeImage from '../assets/locations/angler-lodge.png'
import '../styles/landing.css'

const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.nathanmiller.fishingadventure'

const waters = [
  ['Backyard Pond', 'A familiar place to begin.', pondImage],
  ['Pine River', 'Wade into cool moving water.', riverImage],
  ['Great Lake', 'Work shoreline, weeds, and deep structure.', lakeImage],
  ['Gulf Coast', 'Explore marsh, reefs, and tidal channels.', coastImage],
  ['Open Gulf', 'Follow the Captain into blue water.', gulfImage],
]

const features = [
  ['fish-ripple', 'Fish with care', 'Cast, watch for the strike, and manage line tension through a focused one-touch fight.'],
  ['field-journal', 'Build your journal', 'Discover dozens of believable freshwater, coastal, and offshore species with personal records.'],
  ['keepsake', 'Make the journey yours', 'Preserve trophy fish and fill permanent cabins with keepsakes, paintings, and earned decor.'],
]

const faqs = [
  ['Is Fishing Adventure free to play?', 'Yes. The complete fishing journey, progression, equipment, and earned cabins are designed to remain enjoyable without spending money.'],
  ['Does the game have ads or energy timers?', 'No. Fishing Adventure has no ads, forced waiting energy, loot boxes, or daily-pressure mechanics.'],
  ['What can be purchased?', 'Optional purchases are permanent cosmetic cabins, boat styles, and supporter items. They never improve catch odds, fishing power, coins, or progression.'],
  ['Does it need an account?', 'No. Your fishing progress stays locally on your device, and the game does not require an account.'],
]

export default function Landing() {
  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    document.title = 'Fishing Adventure — One More Cast'
    if (description) description.content = 'A peaceful fishing game about discovery, memorable catches, and a cabin that becomes your own.'
    return () => {
      document.title = previousTitle
      if (description && previousDescription) description.content = previousDescription
    }
  }, [])

  return <div className="fa-landing">
    <header className="fa-landing-header">
      <a className="fa-landing-brand" href="#top" aria-label="Fishing Adventure landing page">
        <img src="/brand/fishing-adventure-icon.png" alt=""/>
        <span>Fishing Adventure</span>
      </a>
      <nav aria-label="Website navigation">
        <a href="#features">Features</a>
        <a href="#waters">Waters</a>
        <a href="#cabins">Cabins</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a className="fa-header-action" href={googlePlayUrl} target="_blank" rel="noreferrer">Join testing</a>
    </header>

    <main id="top">
      <section className="fa-hero">
        <div className="fa-hero-art" aria-hidden="true"/>
        <div className="fa-landing-shell fa-hero-copy">
          <p className="fa-kicker">A quiet world of memorable catches</p>
          <h1>One more cast.</h1>
          <p>Explore peaceful waters, learn where fish gather, build a lasting collection, and return to a cabin filled with the story of your journey.</p>
          <div className="fa-actions">
            <a className="fa-button fa-button-primary" href={googlePlayUrl} target="_blank" rel="noreferrer">Join testing on Google Play</a>
            <a className="fa-button fa-button-secondary" href="/">Play in your browser</a>
          </div>
          <div className="fa-trust" aria-label="Game promises"><span>No ads</span><span>No energy timers</span><span>No pay to win</span></div>
        </div>
      </section>

      <section className="fa-section" id="features">
        <div className="fa-landing-shell">
          <div className="fa-heading"><p className="fa-kicker">Fishing at your pace</p><h2>Simple to begin. Satisfying to master.</h2><p>The controls stay approachable while tackle, habitat, timing, and careful line control give every trip purpose.</p></div>
          <div className="fa-feature-grid">{features.map(([icon, title, copy]) => <article key={title}><span className="fa-icon"><Icon name={icon}/></span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="fa-water-section" id="waters">
        <div className="fa-landing-shell">
          <div className="fa-heading"><p className="fa-kicker">Five distinct destinations</p><h2>Follow the water outward.</h2><p>Begin close to home, then earn your way toward rivers, inland seas, coastal marsh, and the open Gulf.</p></div>
          <div className="fa-water-grid">{waters.map(([name, copy, image]) => <article key={name}><img src={image} alt={`${name} fishing scenery`}/><div><h3>{name}</h3><p>{copy}</p></div></article>)}</div>
        </div>
      </section>

      <section className="fa-section" id="cabins">
        <div className="fa-landing-shell fa-cabin-grid">
          <div className="fa-cabin-art"><img src={lodgeImage} alt="Angler's Lodge with mounted trophy fish and a keepsake cabinet"/></div>
          <div><p className="fa-kicker">A journey you can see</p><h2>Your cabin remembers.</h2><p>Exceptional catches become trophy mounts. Explored waters leave keepsakes behind. Paintings, model boats, and cabin decor turn progress into a warm place that feels unmistakably yours.</p><ul><li>Permanent earned cabins and decor</li><li>Preserved personal-best specimens</li><li>Shareable cabin portraits</li></ul></div>
        </div>
      </section>

      <section className="fa-preview" id="preview">
        <div className="fa-landing-shell fa-preview-grid">
          <div><p className="fa-kicker">Built with respect for players</p><h2>The whole fishing adventure comes first.</h2><p>Coins come from fishing. Rods, reusable lures, boats, trips, collections, and earned cabins belong to the game itself. Optional purchases are permanent cosmetics and supporter choices—not shortcuts.</p></div>
          <aside><strong>Fishing Adventure promise</strong><span>✓ No advertisements</span><span>✓ No loot boxes</span><span>✓ No consumable bait grind</span><span>✓ No paid fishing power</span><span>✓ No forced daily pressure</span></aside>
        </div>
      </section>

      <section className="fa-section" id="faq">
        <div className="fa-landing-shell fa-faq-grid">
          <div><p className="fa-kicker">Questions</p><h2>Before you cast.</h2></div>
          <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="fa-cta">
        <div className="fa-landing-shell"><img src="/brand/fishing-adventure-icon.png" alt=""/><p className="fa-kicker">Now testing on Android</p><h2>Help shape the adventure.</h2><p>Join the Fishing Adventure test on Google Play, or cast a line right now in your browser.</p><div className="fa-actions fa-cta-actions"><a className="fa-button fa-button-light" href={googlePlayUrl} target="_blank" rel="noreferrer">Join Google Play testing</a><a className="fa-button fa-button-secondary" href="/">Play in your browser</a></div></div>
      </section>
    </main>

    <footer className="fa-footer"><div className="fa-landing-shell"><div><strong>Fishing Adventure</strong><p>© 2026 Nathan Miller. All rights reserved.</p></div><nav aria-label="Footer navigation"><a href="#features">Features</a><a href="#waters">Waters</a><a href="#faq">FAQ</a><a href="/privacy.html">Privacy Policy</a><a href="mailto:nathansmiller1982@gmail.com">Contact</a></nav></div></footer>
  </div>
}
