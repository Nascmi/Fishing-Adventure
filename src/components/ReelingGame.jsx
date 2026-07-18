import { useEffect, useMemo, useRef, useState } from 'react'
import { GAME_CONFIG } from '../data/config'
import Icon from './Icon'

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value))

export default function ReelingGame({ catchItem, fish, rod, onCatch, onEscape }) {
  const tuning = GAME_CONFIG.reeling
  const holding = useRef(false)
  const game = useRef({
    tension: tuning.startingTension,
    progress: tuning.startingProgress,
    elapsed: 0,
  })
  const finished = useRef(false)
  const [display, setDisplay] = useState(game.current)

  const difficulty = useMemo(() => {
    const sizePosition = (catchItem.weight - fish.minWeight) / (fish.maxWeight - fish.minWeight)
    return tuning.rarityDifficulty[fish.rarity] * (0.94 + clamp(sizePosition, 0, 1) * 0.12)
  }, [catchItem.weight, fish, tuning.rarityDifficulty])

  useEffect(() => {
    let animationFrame
    let previousTime = performance.now()
    let lastDisplayTime = previousTime

    const tick = (time) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05)
      previousTime = time
      const current = game.current
      current.elapsed += delta

      const fishPull = 1 + Math.max(0, Math.sin(current.elapsed * (2.4 + difficulty))) * 0.22
      if (holding.current) {
        current.tension += tuning.tensionRisePerSecond * difficulty * fishPull * (1 - rod.lineControl) * delta
        const controlBonus = 1 + rod.lineControl * 0.35
        const usefulTension = current.tension >= tuning.safeTensionMin && current.tension <= tuning.safeTensionMax
        current.progress += tuning.progressPerSecond * controlBonus / difficulty * (usefulTension ? 1 : 0.45) * delta
      } else {
        current.tension -= tuning.tensionRecoveryPerSecond * (1 + rod.lineControl) * delta
        if (current.elapsed > 1.2) current.progress -= tuning.progressLossPerSecond * difficulty * delta
      }

      current.tension = clamp(current.tension)
      current.progress = clamp(current.progress)

      if (current.progress >= 100 && !finished.current) {
        finished.current = true
        onCatch()
        return
      }
      if ((current.tension >= 100 || current.progress <= 0) && !finished.current) {
        finished.current = true
        onEscape()
        return
      }

      if (time - lastDisplayTime >= 45) {
        setDisplay({ ...current })
        lastDisplayTime = time
      }
      animationFrame = requestAnimationFrame(tick)
    }

    animationFrame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(animationFrame)
      holding.current = false
    }
  }, [difficulty, onCatch, onEscape, rod.lineControl, tuning])

  const startReeling = (event) => {
    event.preventDefault()
    if (event.pointerId != null) event.currentTarget.setPointerCapture?.(event.pointerId)
    holding.current = true
  }
  const stopReeling = () => { holding.current = false }
  const tensionState = display.tension > tuning.safeTensionMax ? 'Ease off' : display.tension < tuning.safeTensionMin ? 'Reel steadily' : 'Good tension'

  return <section className="reeling-game" aria-label="Reeling mini-game"><div className="reeling-hud"><div className="reeling-heading"><div><span className="eyebrow">Something is on the line</span><h3>Keep steady</h3></div><span className={`tension-label ${display.tension > tuning.safeTensionMax ? 'danger' : ''}`}>{tensionState}</span></div><div className="tension-track" role="meter" aria-label="Line tension" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(display.tension)}><span className="safe-zone"/><i style={{ left: `${display.tension}%` }}/></div><div className="catch-progress"><span>Catch progress</span><b>{Math.round(display.progress)}%</b><div><i style={{ width: `${display.progress}%` }}/><span className="fish-progress-marker" style={{ left: `${display.progress}%` }}><Icon name="fish" size={18}/></span></div></div></div><button className="reel-control" onPointerDown={startReeling} onPointerUp={stopReeling} onPointerCancel={stopReeling} onLostPointerCapture={stopReeling} onBlur={stopReeling} onKeyDown={(event) => { if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) startReeling(event) }} onKeyUp={(event) => { if (event.key === ' ' || event.key === 'Enter') stopReeling() }}><span>Hold to reel</span><small>Release when the line gets tight</small></button></section>
}
