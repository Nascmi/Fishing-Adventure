import { useEffect, useMemo, useRef, useState } from 'react'
import { GAME_CONFIG } from '../data/config'
import { advanceReeling } from '../game/reelingRules'
import Icon from './Icon'

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value))

export default function ReelingGame({ catchItem, fish, rod, onCatch, onEscape }) {
  const tuning = GAME_CONFIG.reeling
  const holding = useRef(false)
  const game = useRef({
    tension: tuning.startingTension,
    progress: tuning.startingProgress,
    lineStrain: 0,
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
      const result = advanceReeling(game.current, { holding: holding.current, difficulty, lineControl: rod.lineControl, delta, tuning })
      game.current = result.state
      const current = result.state

      if (result.outcome === 'caught' && !finished.current) {
        finished.current = true
        onCatch()
        return
      }
      if (result.outcome === 'escaped' && !finished.current) {
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
  const tensionState = display.tension > tuning.safeTensionMax ? 'Line may break!' : display.tension < tuning.safeTensionMin ? 'Fish is slipping!' : 'Good tension'
  const tensionDanger = display.tension > tuning.safeTensionMax || display.tension < tuning.safeTensionMin

  return <section className="reeling-game" aria-label="Reeling mini-game"><div className="reeling-hud"><div className="reeling-heading"><div><span className="eyebrow">Something is on the line</span><h3>Keep steady</h3></div><span className={`tension-label ${tensionDanger ? 'danger' : ''}`}>{tensionState}</span></div><div className="tension-track" role="meter" aria-label="Line tension" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(display.tension)}><span className="safe-zone"/><i style={{ left: `${display.tension}%` }}/></div><div className="catch-progress"><span>Catch progress</span><b>{Math.round(display.progress)}%</b><div><i style={{ width: `${display.progress}%` }}/><span className="fish-progress-marker" style={{ left: `${display.progress}%` }}><Icon name="fish" size={18}/></span></div></div></div><button className="reel-control" onPointerDown={startReeling} onPointerUp={stopReeling} onPointerCancel={stopReeling} onLostPointerCapture={stopReeling} onBlur={stopReeling} onKeyDown={(event) => { if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) startReeling(event) }} onKeyUp={(event) => { if (event.key === ' ' || event.key === 'Enter') stopReeling() }}><span>Hold to reel</span><small>Release when the line gets tight</small></button></section>
}
