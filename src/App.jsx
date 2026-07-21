import { useEffect, useRef, useState } from 'react'
import Icon from './components/Icon'
import NavBar from './components/NavBar'
import StatsPanel from './components/StatsPanel'
import TopBar from './components/TopBar'
import { REACTION_OPTIONS } from './data/config'
import { futureLocations, getLocation } from './data/locations'
import { useGame } from './hooks/useGame'
import CollectionPage from './pages/CollectionPage'
import CabinPage from './pages/CabinPage'
import FishingPage from './pages/FishingPage'
import InventoryPage from './pages/InventoryPage'
import ShopPage from './pages/ShopPage'
import TripsPage from './pages/TripsPage'
import { setPondAmbienceEnabled, setRainAmbienceEnabled } from './services/feedbackService'

export default function App() {
  const [page, setPage] = useState('fishing')
  const [locationId, setLocationId] = useState('willow-pond')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const closeButtonRef = useRef(null)
  const settingsDialogRef = useRef(null)
  const settingsTriggerRef = useRef(null)
  const { game, actions, notice, storageAvailable } = useGame()
  const rainActive = game.weather.rainRemainingMs > 0
  const pages = {
    fishing: <FishingPage locationId={locationId} onLocationChange={setLocationId} onOpenCabin={() => setPage('cabin')}/>,
    cabin: <CabinPage onGoFishing={() => { setLocationId('willow-pond'); setPage('fishing') }}/>,
    inventory: <InventoryPage />,
    shop: <ShopPage location={getLocation(locationId)} />,
    collection: <CollectionPage />,
    trips: <TripsPage currentLocationId={locationId} onChooseLocation={setLocationId} onGoFishing={() => setPage('fishing')}/>,
  }

  useEffect(() => {
    setPondAmbienceEnabled(page === 'fishing' && locationId === 'willow-pond' && game.settings.ambienceEnabled)
    setRainAmbienceEnabled(page === 'fishing' && rainActive && game.settings.ambienceEnabled)
    return () => {
      setPondAmbienceEnabled(false)
      setRainAmbienceEnabled(false)
    }
  }, [game.settings.ambienceEnabled, locationId, page, rainActive])

  useEffect(() => {
    if (!settingsOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleDialogKeys = (event) => {
      if (event.key === 'Escape') {
        setSettingsOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...(settingsDialogRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleDialogKeys)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleDialogKeys)
      settingsTriggerRef.current?.focus()
    }
  }, [settingsOpen])

  const reset = () => {
    if (!window.confirm('Reset all Fishing Adventure progress? This cannot be undone.')) return
    actions.reset()
    setSettingsOpen(false)
    setPage('fishing')
    setLocationId('willow-pond')
  }

  const setAmbience = (enabled) => {
    setPondAmbienceEnabled(enabled && page === 'fishing' && locationId === 'willow-pond')
    setRainAmbienceEnabled(enabled && page === 'fishing' && rainActive)
    actions.setFeedbackSetting('ambienceEnabled', enabled)
  }

  return <div className="app-shell">
    <TopBar location={getLocation(locationId)}/>
    {notice && <div className="notice" role="alert"><span>{notice}</span><button onClick={actions.dismissNotice}>Dismiss</button></div>}
    {!storageAvailable && <div className="notice warning" role="alert">Progress cannot be saved in this browser session. Check your storage or privacy settings.</div>}
    <div className="app-content">{pages[page]}</div>
    <button ref={settingsTriggerRef} className="settings-trigger" onClick={() => setSettingsOpen(true)} aria-label="Open profile and settings"><Icon name="settings" size={21}/></button>
    <NavBar page={page} setPage={setPage}/>

    {settingsOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false) }}>
      <section ref={settingsDialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
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
            <label><span><b>Nature ambience</b><small>Soft pond sounds and passing rain when available</small></span><input type="checkbox" checked={game.settings.ambienceEnabled} onChange={(event) => setAmbience(event.target.checked)}/></label>
            <label><span><b>Haptics</b><small>Brief vibration on supported devices</small></span><input type="checkbox" checked={game.settings.hapticsEnabled} onChange={(event) => actions.setFeedbackSetting('hapticsEnabled', event.target.checked)}/></label>
          </div>
        </div>

        {futureLocations.length > 0 && <h3>Future waters</h3>}
        <div className="locked-list">{futureLocations.map((name) => <span key={name}>{name} · Locked</span>)}</div>
        <button className="danger-button" onClick={reset}>Reset progress</button>
      </section>
    </div>}
  </div>
}
