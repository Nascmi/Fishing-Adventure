import { describe, expect, it } from 'vitest'
import { newGame } from '../services/saveService'
import { DERBY_CAST_LIMIT, abandonDerby, recordActivityCast, recordActivityOutcome, startDerby, syncFieldNotes, validateActivities } from './activityRules'

const catchItem = (fishId = 'bluegill', sizeTier = 'regular') => ({ fishId, sizeTier, weight: 1 })

describe('calm optional activities', () => {
  it('keeps a maximum three-day Field Note backlog without streak penalties', () => {
    let state = newGame()
    state = syncFieldNotes(state, '2026-07-20')
    state = syncFieldNotes(state, '2026-07-21')
    state = syncFieldNotes(state, '2026-07-22')
    state = syncFieldNotes(state, '2026-07-23')
    expect(state.activities.fieldNotes.entries.map((entry) => entry.createdDay)).toEqual(['2026-07-21', '2026-07-22', '2026-07-23'])
    expect(syncFieldNotes(state, '2026-07-23')).toBe(state)
  })

  it('progresses notes through ordinary catches and awards each completion once', () => {
    let state = syncFieldNotes(newGame(), '2026-07-20')
    const startCoins = state.coins
    for (let index = 0; index < 4; index += 1) state = recordActivityOutcome(state, 'willow-pond', catchItem('bluegill', 'good'), 100 + index)
    expect(state.activities.fieldNotes.entries[0].completedAt).toBeTruthy()
    expect(state.coins).toBeGreaterThan(startCoins)
    const completedCoins = state.coins
    state = recordActivityOutcome(state, 'willow-pond', catchItem('bluegill', 'good'), 200)
    expect(state.coins).toBe(completedCoins)
  })

  it('runs a fixed-cast personal derby and retains the better local result', () => {
    let state = startDerby(newGame(), 'willow-pond', 1)
    for (let index = 0; index < DERBY_CAST_LIMIT; index += 1) {
      state = recordActivityCast(state, 'willow-pond')
      state = recordActivityOutcome(state, 'willow-pond', index < 2 ? catchItem(index ? 'sunfish' : 'bluegill', 'good') : null, 10 + index)
    }
    expect(state.activities.derbies.active).toBeNull()
    expect(state.activities.derbies.personalBests['willow-pond']).toMatchObject({ score: 350, catches: 2 })
    const best = state.activities.derbies.personalBests['willow-pond']
    state = startDerby(state, 'willow-pond', 100)
    for (let index = 0; index < DERBY_CAST_LIMIT; index += 1) {
      state = recordActivityCast(state, 'willow-pond')
      state = recordActivityOutcome(state, 'willow-pond', null, 200 + index)
    }
    expect(state.activities.derbies.personalBests['willow-pond']).toEqual(best)
  })

  it('pauses a derby at other waters and supports a consequence-free abandon', () => {
    let state = startDerby(newGame(), 'willow-pond')
    expect(recordActivityCast(state, 'pine-river')).toBe(state)
    state = abandonDerby(state)
    expect(state.activities.derbies.active).toBeNull()
  })

  it('bounds malformed saved activity data', () => {
    const activities = validateActivities({ fieldNotes: { entries: [{ id: 'bad' }], lastGeneratedDay: 'bad' }, derbies: { active: { locationId: 'unknown' }, personalBests: { unknown: { score: 999 } } } })
    expect(activities).toEqual({ fieldNotes: { entries: [], lastGeneratedDay: null }, derbies: { active: null, personalBests: {} } })
  })
})
