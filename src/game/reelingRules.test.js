import { describe, expect, it } from 'vitest'
import { GAME_CONFIG } from '../data/config'
import { advanceReeling } from './reelingRules'

const tuning = GAME_CONFIG.reeling
const start = () => ({ tension: tuning.startingTension, progress: tuning.startingProgress, lineStrain: 0, elapsed: 0 })
const step = (state, holding, difficulty = 1.3, lineControl = 0) => advanceReeling(state, { holding, difficulty, lineControl, delta: 0.05, tuning })

describe('reeling tension', () => {
  it('breaks the line when a large fish is reeled continuously', () => {
    let result = { state: start(), outcome: null }
    for (let frame = 0; frame < 200 && !result.outcome; frame += 1) result = step(result.state, true)
    expect(result.outcome).toBe('escaped')
    expect(result.state.progress).toBeLessThan(100)
  })

  it('lands a large fish by releasing before the line becomes overstrained', () => {
    let result = { state: start(), outcome: null }
    for (let frame = 0; frame < 600 && !result.outcome; frame += 1) result = step(result.state, result.state.tension < 64)
    expect(result.outcome).toBe('caught')
    expect(result.state.lineStrain).toBeLessThan(100)
  })

  it('can snap an already strained line before tension reaches its absolute limit', () => {
    const result = step({ tension: 74, progress: 50, lineStrain: 99, elapsed: 2 }, true)
    expect(result.outcome).toBe('escaped')
    expect(result.state.tension).toBeLessThan(100)
  })

  it('loses progress faster while the line is slack', () => {
    const safe = step({ tension: 40, progress: 50, lineStrain: 0, elapsed: 2 }, false).state
    const slack = step({ tension: 10, progress: 50, lineStrain: 0, elapsed: 2 }, false).state
    expect(50 - slack.progress).toBeGreaterThan(50 - safe.progress)
  })
})
