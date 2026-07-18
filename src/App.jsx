import { useEffect, useRef, useState } from 'react'
import Icon from './components/Icon'
import NavBar from './components/NavBar'
import StatsPanel from './components/StatsPanel'
import TopBar from './components/TopBar'
import { REACTION_OPTIONS } from './data/config'
import { futureLocations } from './data/locations'
import { useGame } from './hooks/useGame'
import CollectionPage from './pages/CollectionPage'
import FishingPage from './pages/FishingPage'
import InventoryPage from './pages/InventoryPage'
import ShopPage from './pages/ShopPage'
import { setPondAmbienceEnabled } from './services/feedbackService'

export default function App() {
  const [page, setPage] = useState('fishing')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const closeButtonRef = useRef(null)
  const { game, actions, notice, storageAvailable } = useGame()
  const pages = {
    fishing: <FishingPage />,
    inventory: <InventoryPage />,
    shop: <ShopPage />,
    collection: <CollectionPage />,
  }

  useEffect(() => {
    setPondAmbienceEnabled(page === 'fishing' && game.settings.ambienceEnabled)
    return () => setPondAmbienceEnabled(false)
  }, [game.settings.ambienceEnabled, page])

  useEffect(() => {
    if (!settingsOpen) return undefined
    closeButtonRef.current?.focus()
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSettingsOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [settingsOpen])

  const reset = () => {
    if (!window.confirm('Reset all Fishing Adventure progress? This cannot be undone.')) return
    actions.reset()
    setSettingsOpen(false)
    setPage('fishing')
  }

  const setAmbience = (enabled) => {
    setPondAmbienceEnabled(enabled && page === 'fishing')
    actions.setFeedbackSetting('ambienceEnabled', enabled)
  }

  return <div className="app-shell">
    <TopBar/>
    {notice && <div className="notice" role="alert"><span>{notice}</span><button onClick={actions.dismissNotice}>Dismiss</button></div>}
    {!storageAvailable && <div className="notice warning" role="alert">Progress cannot be saved in this browser session. Check your storage or privacy settings.</div>}
    <div className="app-content">{pages[page]}</div>
    <button className="settings-trigger" onClick={() => setSettingsOpen(true)} aria-label="Open profile and settings"><Icon name="settings" size={21}/></button>
    <NavBar page={page} setPage={setPage}/>

    {settingsOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false) }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <button ref={closeButtonRef} className="modal-close" onClick={() => setSettingsOpen(false)} aria-label="Close settings">×</button>
        <span className="eyebrow">Angler profile</span>
        <h2 id="settings-title">Journey & Settings</h2>
        <StatsPanel/>

        <div className="settings-section">
          <h3>Bite timing</h3>
          <p>Choose a comfortable reaction window. This does not change which fish you catch.</p>
          <div className="segmented-control">{REACTION_OPTIONS.map((option) => <button key={option.id} className={game.settings.reactionWindow === option.id ? 'selected' : ''} onClick={() => actions.setReactionWindow(option.id)} aria-pressed={game.settings.reactionWindow === option.id}><b>{option.label}</b><span>{option.description}</span></button>)}</div>
        </div>

        <div className="settings-section">
          <h3>Feedback</h3>
          <p>Sound and vibration are gentle, optional, and saved on this device.</p>
          <div className="toggle-list">
            <label><span><b>Sound cues</b><small>Soft tones for bites, catches, and coins</small></span><input type="checkbox" checked={game.settings.soundEnabled} onChange={(event) => actions.setFeedbackSetting('soundEnabled', event.target.checked)}/></label>
            <label><span><b>Pond ambience</b><small>Very soft water and wind through reeds · no music</small></span><input type="checkbox" checked={game.settings.ambienceEnabled} onChange={(event) => setAmbience(event.target.checked)}/></label>
            <label><span><b>Haptics</b><small>Brief vibration on supported devices</small></span><input type="checkbox" checked={game.settings.hapticsEnabled} onChange={(event) => actions.setFeedbackSetting('hapticsEnabled', event.target.checked)}/></label>
          </div>
        </div>

        <h3>Future waters</h3>
        <div className="locked-list">{futureLocations.map((name) => <span key={name}>{name} · Locked</span>)}</div>
        <button className="danger-button" onClick={reset}>Reset progress</button>
      </section>
    </div>}
  </div>
}
